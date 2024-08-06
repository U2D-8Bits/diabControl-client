import { Component, Input, OnInit } from '@angular/core';
import { User } from '../../../../auth/interfaces';
import { SocketWebService } from '../../../services/socket/socket.service';

@Component({
  selector: 'component-chat-message',
  templateUrl: './chat-message.component.html',
  styleUrl: './chat-message.component.css'
})
export class ChatMessageComponent implements OnInit {

  @Input() currentUser!: User;
  @Input() selectedUser!: User;

  messages: any[] = [];
  newMessage: string = '';

  get userID(): number {
    return this.currentUser.id_user;
  }

  constructor(
    private socketService: SocketWebService
  ){}

  ngOnInit(): void {
    this.socketService.onMessage()
    .subscribe((message: any) =>{
      this.messages.push(message)
    })
  }

  sendMessage(): void {
    if( this.newMessage.trim().length === 0){
      return;
    }

    const message = {
      sender: this.currentUser,
      receiver: this.selectedUser,
      content: this.newMessage,
      timestamp: new Date()
    };

    this.messages.push(message);
    this.socketService.sendMessage(message);
    this.newMessage = '';
  }

}
