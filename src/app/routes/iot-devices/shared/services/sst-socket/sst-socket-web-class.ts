import {  Observable } from 'rxjs';
import { SSTSocketContract } from './contracts/sst-socket-contract';


export class SstSocketWebClass extends SSTSocketContract {

    private _socket: WebSocket;
    private _countConnectError: number = 0;

    constructor() {
        super()
     }

    setupSocketConnection(ip: string, port?: string): Observable<any> {
        if(this._socket)
            this._socket.close(1000, 'Free Connection')
        this._socket = new WebSocket(`ws://${ip}:${port}`)
        this.initSubject();
        this._socket.addEventListener("open", () => {
            this.isActive$.next({active:true, socketId: 'Connection successfully'})
        });
        this.connectionError()
        this.lostConnection()
        return this.isActive$.asObservable();
    }

    listenMessages(): Observable<any> {
        this._socket.addEventListener("message", (message) => {
            return this.anyMessage$.next({ eventName: '', params:  message.data })
        });
        return this.anyMessage$.asObservable()

    }

    connectionError(): Observable<any> {
        this._socket.addEventListener("error", ( error ) => {
                this.connectionError$.next({active:false , error:error})
        });
        return this.connectionError$.asObservable();
    }

    disconnect(): void {
        this.closeListener()
        if(this._socket)
        {
            this._socket.close(1000, 'Free Connection');
        }
    }

    lostConnection(): void{
        this._socket.addEventListener("close", (message) => {
            this.isActive$.next({active:false, socketId: 'the connection was lost'})
            this.disconnect()
        });
    }
}
