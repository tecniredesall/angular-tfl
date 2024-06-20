import { log } from "console";
import { BehaviorSubject, Observable, Subject } from "rxjs";

export abstract class SSTSocketContract {

    public message$: BehaviorSubject<string> = new BehaviorSubject('');
    public anyMessage$: BehaviorSubject<any> = new BehaviorSubject({});
    public isActive$: Subject<any> = new Subject();
    public connectionError$: Subject<any> = new Subject();

    constructor(){
    }

    abstract  setupSocketConnection(ip:string , port?:string) : Observable<any>;
    abstract  listenMessages() : Observable<any>;
    abstract  connectionError() : Observable<any>;
    abstract  lostConnection() : void;
    abstract  disconnect(): void;

    public initSubject(){
        this.message$.complete();
        this.anyMessage$.complete();
        this.isActive$ .complete();
        this.connectionError$ .complete();

        this.message$ = new BehaviorSubject('');
        this.anyMessage$ = new BehaviorSubject({});
        this.isActive$  = new Subject();
        this.connectionError$  = new Subject();
    }

    public closeListener(): void{
        this.message$.complete();
        this.anyMessage$.complete();
        this.isActive$.complete();
        this.connectionError$.complete();
    }
}

export const enum SocketType {
    WEB_SOCKET = 1,
    SOCKET_IO = 2
}


export const enum  SCALES_LISTENER_ACTIONS {
    RETRY_CONNECTION = 1,
    WIGHT_AGAIN = 2,
}
