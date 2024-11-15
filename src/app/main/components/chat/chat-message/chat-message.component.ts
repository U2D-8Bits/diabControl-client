import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { User } from '../../../../auth/interfaces';
import { SocketWebService } from '../../../services/socket/socket.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'component-chat-message',
  templateUrl: './chat-message.component.html',
  styleUrls: ['./chat-message.component.css']
})
export class ChatMessageComponent implements OnInit, OnDestroy {
  @Input() currentUser!: User;
  @Input() selectedUser!: User;

  messages: any[] = [];
  newMessage: string = '';
  private messageSubscription!: Subscription;

  get userID(): number {
    return this.currentUser.id_user;
  }

  constructor(
    private socketService: SocketWebService
  ) {}

  ngOnInit(): void {
    this.messageSubscription = this.socketService.onMessage().subscribe((message: any) => {
      this.messages.push(message);
    });
  }

  sendMessage(): void {
    if (this.newMessage.trim().length === 0) {
      return;
    }

    const message = {
      chatRoomId: this.socketService.currentChatRoomId,
      sender: this.currentUser,
      content: this.newMessage,
      timestamp: new Date()
    };

    this.messages.push(message);
    this.socketService.sendMessage(message);
    this.newMessage = '';
  }

  ngOnDestroy(): void {
    if (this.messageSubscription) {
      this.messageSubscription.unsubscribe();
    }
  }
}
