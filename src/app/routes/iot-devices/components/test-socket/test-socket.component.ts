import { FormControl, FormGroup } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { take, takeUntil } from 'rxjs/operators';
import { BehaviorSubject, Subject } from 'rxjs';
import { IIoTRecord } from '../../models/iot-record.model';
import { IotDevicesService } from '../../services/iot-devices/iot-devices.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NotifierService } from 'angular-notifier';
import { Socket, io } from 'socket.io-client';
import { SSTSocketContract, SocketType } from '../../shared/services/sst-socket/contracts/sst-socket-contract';
import { SstSocketService } from '../../shared/services/sst-socket/sst-socket.service';
import { SstSocketIOClass } from '../../shared/services/sst-socket/sst-socket-io-class';
@Component({
    selector: 'sst-test-socket',
    templateUrl: './test-socket.component.html',
    styleUrls: ['./test-socket.component.scss']
})
export class TestSocketComponent implements OnInit {
    public scales: IIoTRecord[] = [];
    public selectedScale: IIoTRecord = null;
    public isLoadingScales: boolean = true;
    public formSocket: FormGroup
    public messageList: string[] = []
    private destroy$: Subject<boolean> = new Subject<boolean>();
    private destroyActive$: Subject<boolean> = new Subject<boolean>();
    private socketScales: { scale: IIoTRecord, socket: SSTSocketContract }[] = []
    public socketId: string = ''
    public scaleActive: boolean = false;
    public counter: number = 1;
    private _socket: SSTSocketContract;
    private _sstSocketServiceIO:SstSocketIOClass
    constructor(
        private __iotDevicesService: IotDevicesService,
        private _sstSocketService: SstSocketService,
        private _notifierService: NotifierService,
    ) {
        this._sstSocketServiceIO = new SstSocketIOClass()
        this._initForm()
    }

    ngOnInit(): void {
        //this.getScales()
    }

    CreateWebSocket() {
        this._socket = this._sstSocketService.createSocketService(SocketType.WEB_SOCKET)
        this.Conectar()
    }


    CreateSocketIO(){
        this._socket = this._sstSocketService.createSocketService(SocketType.SOCKET_IO)
        this.Conectar();
    }

    Conectar() {
        const { ip, port } = this.formSocket.getRawValue()
        this._socket.setupSocketConnection(ip, port)
        this.ListenIsActive();
    }

    Enviar() {
        const eventName: string = 'message'
        this._sstSocketServiceIO.sendMessageEvent(eventName, this.formSocket.controls.message.value)
    }

    ListenIsActive() {
        this._socket.isActive$.pipe(takeUntil(this.destroyActive$)).subscribe((result) => {
            this.scaleActive = result.active;
            this.socketId = result.socketId;
            this.counter++;
            if(result.active){
                this.ListenAllMessages();
            }
        })
    }

    ListenMessages() {
        const eventName: string = 'message'
        this._sstSocketServiceIO.listenEventName(eventName).subscribe((message: string) => {
            this.messageList.push(message);
        })
    }

    ListenAllMessages() {
        this.messageList = []
        this._socket.listenMessages().pipe(takeUntil(this.destroy$)).subscribe((data) => {
            this.messageList.push(data);
        })
    }

    Simulateweigth() {
        const event: string = 'generateData'
        this.messageList = []
        this._sstSocketServiceIO.sendMessageEvent(event, `ready...`)
        this._sstSocketServiceIO.listenEventName(event).subscribe((message) => {
            this.messageList.push(message);
        })
    }

    desconectar() {

        this.scaleActive = false;
        this.socketId = ''
        this.destroyActive$.next(true)
        this.destroyActive$.complete()
        this.destroy$.next(true)
        this.destroy$.complete()
        this.counter = 1;
        this._socket.disconnect()


    }

    private _initForm() {
        this.formSocket = new FormGroup({
            ip: new FormControl(`127.0.0.1`),
            port: new FormControl(`8000`),
            message: new FormControl(`Hola socket.io`),
        });
    }

    onChangeScale(scale: IIoTRecord) {
        this.formSocket.patchValue({ port: scale.port })
        this._socket = this.socketScales.find(x=> x.scale.id == scale.id).socket
        this._socket.setupSocketConnection(scale.ipAddress,scale.port.toString())
        this.Conectar()
    }

    private getScales(): void {
        this.__iotDevicesService.getScalesByUser().pipe(
            takeUntil(this.destroy$),
            take(1)
        ).subscribe(
            (response: IIoTRecord[]) => {
                this.scales = Array.from(response);
                this.isLoadingScales = false;
                this.checkStatus()
            },
            (error: HttpErrorResponse) => {

                this.isLoadingScales = false;
            }
        )
    }

    private checkStatus() {
        for (const item of this.scales) {
            this.socketScales = [...this.socketScales, { scale: item, socket: this._sstSocketService.createSocketService(SocketType.WEB_SOCKET) }]
        }

        for (const item of this.socketScales) {
            item.socket.setupSocketConnection(item.scale.ipAddress.toString(), item.scale.port?.toString())
            item.socket.isActive$.subscribe((result) => {
                this.scales.find(x => x.id == item.scale.id).isActive = result.active
                this.scales.find(x => x.id == item.scale.id).isConnected = result.active
            })

        }
    }
}
