
import { Injectable } from '@angular/core';
import { SSTSocketContract, SocketType } from './contracts/sst-socket-contract';
import { SstSocketIOClass } from './sst-socket-io-class';
import { SstSocketWebClass } from './sst-socket-web-class';


@Injectable({
  providedIn: 'root'
})
export class SstSocketService {

  constructor() { }

  createSocketService(socketType:SocketType) : SSTSocketContract {
    switch (socketType) {
        case SocketType.SOCKET_IO:
            return new SstSocketIOClass()
            break;
        case SocketType.WEB_SOCKET:
            return new SstSocketWebClass()
            break;
        default:
            break;
    }
  }
}
