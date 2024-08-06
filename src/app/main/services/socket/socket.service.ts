import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { User } from '../../../auth/interfaces';

@Injectable({
  providedIn: 'root'
})
export class SocketWebService {
  constructor(private socket: Socket) {}

  connect(token: string) {
    this.socket.ioSocket.io.opts.query = { token };
    this.socket.connect();
  }

  onUserConnected() {
    return this.socket.fromEvent<User>('userConnected');
  }

  onUserDisconnected() {
    return this.socket.fromEvent<User>('userDisconnected');
  }

  onMessage() {
    return this.socket.fromEvent<any>('message');
  }

  sendMessage(message: any) {
    this.socket.emit('message', message);
  }

  disconnect() {
    this.socket.disconnect();
  }
}
