import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, of } from 'rxjs';
import { Socket, io } from 'socket.io-client';
import { SSTSocketContract } from './contracts/sst-socket-contract';

export class SstSocketIOClass extends SSTSocketContract {
    private _socket: Socket;
    private countConnectError: number = 0;
    constructor() {
        super()
     }

    setupSocketConnection(ip: string, port: string = '80') {
        this._socket = io(`http://${ip}:${port}`);
        this.isActive$ = new Subject();
        this._socket.on("connect", () => {
            this.isActive$.next({active:true, socketId: this._socket.id})
            this.listenMessages();
        });
        this.connectionError()
        return this.isActive$.asObservable();
    }

    listenMessages(): Observable<any> {
        this._socket.onAny((eventName: string, params: any) => {
            return this.anyMessage$.next({ eventName: eventName, params: params })
        })
        return this.anyMessage$.asObservable()
    }

    connectionError(): Observable<any> {
        this._socket.on("connect_error", () => {
            if (this.countConnectError > 0) {
                this.isActive$.next({active:false, socketId: ''})
                this.disconnect();
            }
            this.countConnectError++
        });
        return this.connectionError$.asObservable();
    }

    lostConnection(): void {
        this._socket.on("disconnect", () => {
            this.isActive$.next({active:false, socketId: ''})
        });
    }

    public disconnect() {
        try {
            this.closeListener()
            this._socket.disconnect();
            this._socket.close();
        } catch (error) {
            console.error(error)
        }
    }

    public sendMessage(message: any) {
        this._socket.emit('message', message);
    }

    public sendMessageEvent(eventName:string , message: any) {
        this._socket.emit(eventName, message);
    }

    public listenEventName = (eventName: string) => {
        this._socket.on(eventName, (params) => {
            this.anyMessage$.next({ eventName: eventName, params: params });
        });

        return this.anyMessage$.asObservable();
    };
}
