import { Observable, Subject, Subscriber } from 'rxjs';
import { filter, take, takeUntil, timeout } from 'rxjs/operators';
import { io, Socket } from 'socket.io-client';
import { IScaleWeightEvent } from 'src/app/shared/models/scale-weight-event.model';
import { ISocketConfig } from 'src/app/shared/models/socket-config';
import { CONSTANTS } from 'src/app/shared/utils/constants/constants';
import { ISorterMachineEvent } from 'src/app/shared/models/sorter-machine-event.model'
import { Injectable, OnDestroy } from '@angular/core';
import { IotDevicesService } from '../../../services/iot-devices/iot-devices.service';

@Injectable({
    providedIn: 'root',
})
export class ScaleSocketService implements OnDestroy {
    public socketConfig: ISocketConfig;
    public socketConfigIsReady$ = new Subject<boolean>();
    private socket: Socket<any, any> = null;
    private status$: Subject<string> = new Subject<string>();
    private unsubscribeStatus$: Subject<boolean> = new Subject<boolean>();
    private trigger: any;

    constructor(
        private scaleService: IotDevicesService) {
        this.scaleService
            .getIotDevicesConfiguration()
            .pipe(take(1))
            .subscribe((c) => {
                this.socketConfig = c;
                this.socketConfigIsReady$.next(true);
            });
    }

    /**
     * Method called on destroy component
     */
    ngOnDestroy() {
        this.unsubscribeStatus$.next(true);
        this.unsubscribeStatus$.complete();
        this.status$.complete();
    }

    public getAvailableIotDevices() {
        let observable: Observable<any> = new Observable(
            (observer: Subscriber<IScaleWeightEvent>) => {
                // Look connection status event
                this.status$
                    .pipe(
                        filter(
                            (e: string) =>
                                e == CONSTANTS.SOCKET_CLIENT_STATUS.STATUS
                        ),
                        takeUntil(this.unsubscribeStatus$),
                        take(1)
                    )
                    .subscribe((status: string) => {
                        observer.next({
                            eventType:
                                CONSTANTS.IOT_EVENT_TYPE.STATUS_CONNECTION,
                            data: status,
                        });
                    });
                //Do conection
                this.connect();
                //Look for device list event
                this.socket.on(
                    CONSTANTS.SOCKET_CLIENT_STATUS.DEVICE_LIST,
                    (data: any) => {
                        observer.next({
                            eventType:
                                CONSTANTS.SOCKET_CLIENT_STATUS.DEVICE_LIST,
                            data,
                        });
                    }
                );
                //Do request for device list
                this.socket.emit('pool-iot-list', {
                    location: 'Capucas',
                });
                // Method for when the consumer unsubscribes
                return () => {
                    this.unsubscribeStatus$.next(true);
                    this.socket.disconnect();
                };
            }
        );
        return observable;
    }

    public getStatusIotDevice(ipAddress: string, port: number) {
        let observable: Observable<any> = new Observable(
            (observer: Subscriber<IScaleWeightEvent>) => {
                // Connection status event
                this.status$
                    .pipe(
                        takeUntil(this.unsubscribeStatus$),
                        filter(
                            (e: string) =>
                                e == CONSTANTS.SOCKET_CLIENT_STATUS.STATUS
                        )
                    )
                    .subscribe((status: string) => {
                        observer.next({
                            eventType:
                                CONSTANTS.IOT_EVENT_TYPE.STATUS_CONNECTION,
                            data: status,
                        });
                    });
                //Do conection
                this.connect();
                this.socket.emit('is-ip-connected', {
                    location: 'Capucas',
                    ip_address: `::ffff:${ipAddress}`,
                });
                //Look for device list event
                this.socket.on(
                    CONSTANTS.SOCKET_CLIENT_STATUS.DEVICE_STATUS,
                    (data: any) => {
                        observer.next({
                            eventType:
                                CONSTANTS.SOCKET_CLIENT_STATUS.DEVICE_STATUS,
                            data,
                        });
                    }
                );
                //Do request for device list
                this.socket.emit('check-device-status', {
                    location: 'Capucas',
                    ip_address: ipAddress,
                    port: port
                });
                // Method for when the consumer unsubscribes
                return () => {
                    this.unsubscribeStatus$.next(true);
                    this.socket.disconnect();
                };
            }
        );
        return observable;
    }

    /**
     * Method invoked for test connection
     * @param ipAddress of the escale
     * @param port of the escale
     * @returns observable with status and method for when the consumer unsubscribes
     */
    public testConnection(ipAddress?: string, port?: string, isSorterMachine?: boolean): Observable<IScaleWeightEvent> {
        let observable: Observable<any> = new Observable(
            (observer: Subscriber<IScaleWeightEvent>) => {
                // Connection status event
                this.status$
                    .pipe(
                        filter(
                            (e: string) =>
                                e == CONSTANTS.SOCKET_CLIENT_STATUS.STATUS
                        ),
                        takeUntil(this.unsubscribeStatus$),
                        take(1)
                    )
                    .subscribe((status: string) => {
                        observer.next({
                            eventType:
                                CONSTANTS.IOT_EVENT_TYPE.STATUS_CONNECTION,
                            data: status,
                        });
                    });
                this.connect();
                this.socket.on(
                    CONSTANTS.SOCKET_CLIENT_STATUS.STATUS,
                    (data: any) => {
                        observer.next({
                            eventType: CONSTANTS.SOCKET_CLIENT_STATUS.STATUS,
                            data:
                                data === CONSTANTS.SOCKET_CLIENT_STATUS.ONLINE
                                    ? true
                                    : false,
                        });
                    }
                );
                if (!isSorterMachine) {
                    this.socket.emit('is-ip-connected', {
                        location: 'Capucas',
                        ip_address: `::ffff:${ipAddress}`,
                    });
                } else {
                    if (!!isSorterMachine) {
                        this.socket.emit('check-device-status', {
                            location: 'Capucas',
                            ip_address: ipAddress,
                            port: port
                        });
                    }
                }



                // Method for when the consumer unsubscribes
                return () => {
                    this.unsubscribeStatus$.next(true);
                    this.socket.disconnect();
                };
            }
        );
        return observable;
    }

    /**
     * Method invoked for reconnect to scale
     */
    public reconnect(): void {
        this.status$.next(CONSTANTS.SOCKET_CLIENT_STATUS.CONNECTING);
        this.socket.io.open((err: any) => {
            if (err) {
                this.status$.next(CONSTANTS.SOCKET_CLIENT_STATUS.DISCONNECTED);
            }
        });
    }

    /**
     * Method invoked for connect to scale and listening weights
     * @param ipAddress of the escale
     * @param port of the escale
     * @returns observable with status and method for when the consumer unsubscribes
     */
    public getWeights(
        ipAddress: string,
        port?: number
    ): Observable<IScaleWeightEvent> {
        let observable: Observable<IScaleWeightEvent> = new Observable(
            (observer: Subscriber<IScaleWeightEvent>) => {
                // Connection status event
                this.status$
                    .pipe(
                        takeUntil(this.unsubscribeStatus$),
                        filter(
                            (e: string) =>
                                e == CONSTANTS.SOCKET_CLIENT_STATUS.STATUS
                        )
                    )
                    .subscribe((status: string) => {
                        observer.next({
                            eventType:
                                CONSTANTS.IOT_EVENT_TYPE.STATUS_CONNECTION,
                            data: status,
                        });
                    });
                this.connect();
                this.socket.on(
                    CONSTANTS.SOCKET_CLIENT_STATUS.STATUS,
                    (data: any) => {
                        observer.next({
                            eventType:
                                CONSTANTS.IOT_EVENT_TYPE.STATUS_CONNECTION,
                            data:
                                data === CONSTANTS.SOCKET_CLIENT_STATUS.ONLINE
                                    ? CONSTANTS.SOCKET_CLIENT_STATUS.CONNECTED
                                    : CONSTANTS.SOCKET_CLIENT_STATUS
                                        .DISCONNECTED,
                        });
                    }
                );
                this.socket.emit('is-ip-connected', {
                    location: 'Capucas',
                    ip_address: `::ffff:${ipAddress}`,
                });
                this.socket.emit('filter', 'scale')
                // Weight message event
                this.socket.on('metrics', (data: any) => {
                    observer.next({
                        eventType: CONSTANTS.IOT_EVENT_TYPE.WEIGHT,
                        data: data,
                    });
                });
                // Method for when the consumer unsubscribes
                return () => {
                    this.unsubscribeStatus$.next(true);
                    this.socket.disconnect();
                };
            }
        );
        return observable.pipe(
            filter(
                (w) =>
                    w.data[0].ip_address === `::ffff:${ipAddress}` ||
                    w.data === CONSTANTS.SOCKET_CLIENT_STATUS.CONNECTED ||
                    w.data === CONSTANTS.SOCKET_CLIENT_STATUS.DISCONNECTED ||
                    w.data === CONSTANTS.SOCKET_CLIENT_STATUS.CONNECTING
            )
        );
    }

    /**
     * Method invoked for connect to scale and listening weights
     * @param ipAddress of the escale
     * @param port of the escale
     * @returns observable with status and method for when the consumer unsubscribes
     */
    public getJSONSortMachine(
        ipAddress: string, port: number, lotId: string
    ): Observable<ISorterMachineEvent> {
        let observable: Observable<ISorterMachineEvent> = new Observable(
            (observer: Subscriber<ISorterMachineEvent>) => {
                // Connection status event
                this.status$
                    .pipe(
                        takeUntil(this.unsubscribeStatus$),
                        filter(
                            (e: string) =>
                                e == CONSTANTS.SOCKET_CLIENT_STATUS.STATUS
                        )
                    )
                    .subscribe((status: string) => {
                        observer.next({
                            eventType:
                                CONSTANTS.IOT_EVENT_TYPE.STATUS_CONNECTION,
                            data: status,
                        });
                    });
                this.connect();
                this.socket.emit('is-ip-connected', {
                    location: 'Capucas',
                    ip_address: `::ffff:${ipAddress}`,
                });
                this.socket.on(
                    CONSTANTS.SOCKET_CLIENT_STATUS.STATUS,
                    (data: any) => {
                        observer.next({
                            eventType:
                                CONSTANTS.IOT_EVENT_TYPE.STATUS_CONNECTION,
                            data:
                                data === CONSTANTS.SOCKET_CLIENT_STATUS.ONLINE
                                    ? CONSTANTS.SOCKET_CLIENT_STATUS.CONNECTED
                                    : CONSTANTS.SOCKET_CLIENT_STATUS
                                        .DISCONNECTED,
                        });
                    }
                );
                const data = {
                    location: 'Capucas',
                    ip_address: ipAddress,
                    port: port,
                    process_id: lotId,
                    device_type: 'sorter_machine'
                }
                this.socket.emit('filter', 'sorter-machine')
                this.socket.emit('send-device-request', data);
                this.trigger = setInterval((socket) => {
                    socket.emit('send-device-request', data);
                }, CONSTANTS.SORTER_MACHINE_REQUEST_TIME, this.socket);

                // Sorter machine message event
                this.socket.on('metrics', (data: any) => {
                    observer.next({
                        eventType: CONSTANTS.IOT_EVENT_TYPE.SORTER_MACHINE,
                        data: data,
                    });
                });
                return () => {
                    this.unsubscribeStatus$.next(true);
                    this.socket.disconnect();
                };
            }
        );
        return observable.pipe(
            filter(
                (w) =>
                    w.data[0]?.ip_address === ipAddress ||
                    w.data === CONSTANTS.SOCKET_CLIENT_STATUS.CONNECTED ||
                    w.data === CONSTANTS.SOCKET_CLIENT_STATUS.DISCONNECTED ||
                    w.data === CONSTANTS.SOCKET_CLIENT_STATUS.CONNECTING
            )
        );
    }

    /**
     * Method invoked for connect to scale
     * @param ipAddress of the escale
     * @param port of the escale
     */
    private connect(): void {
        if (this.socketConfig) {
            this.status$.next(CONSTANTS.SOCKET_CLIENT_STATUS.CONNECTING);
            this.socket = io(`${this.socketConfig.url}:${this.socketConfig.port}`, {
                forceNew: true,
                reconnectionAttempts: 3,
            });
            this.attachListenerEventsConnection();
        }
    }

    /**
     * Method invoked for attach listener events to connection
     */
    private attachListenerEventsConnection(): void {
        this.socket.on('connect', () => {
            this.status$.next(CONSTANTS.SOCKET_CLIENT_STATUS.CONNECTED);
        });
        this.socket.on('disconnect', (reason: any) => {
            this.status$.next(CONSTANTS.SOCKET_CLIENT_STATUS.DISCONNECTED);
        });
        this.socket.on('reconnect_failed', (err: any) => {
            this.status$.next(CONSTANTS.SOCKET_CLIENT_STATUS.DISCONNECTED);
        });
    }

    public closeTrigger() {
        this.unsubscribeStatus$.next(true);
        this.unsubscribeStatus$.complete();
        this.socket.disconnect();
        clearInterval(this.trigger);
    }
}
