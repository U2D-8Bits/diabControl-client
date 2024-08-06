// src/app/components/chat-page/chat-page.component.ts
import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { RoleService } from '../../../auth/services/role.service';
import { User } from '../../../auth/interfaces/user.interface';
import { SocketWebService } from '../../services/socket/socket.service';

@Component({
  selector: 'app-chat-page',
  templateUrl: './chat-page.component.html',
  styleUrls: ['./chat-page.component.css']
})
export class ChatPageComponent implements OnInit {
  roleID: number = 0;
  userID: number = Number(localStorage.getItem('ID'));
  userNames: string = '';
  users: User[] = [];
  search: string = '';
  selectedUser: User | null = null;
  currentUser!: User;

  constructor(
    private userService: UserService,
    private roleService: RoleService,
    private socketService: SocketWebService
  ) {}

  ngOnInit(): void {
    this.userService.getUserById(this.userID).subscribe({
      next: (data: User) => {
        this.userNames = data.user_name + ' ' + data.user_lastname;
        this.roleID = data.role_id;
        this.currentUser = data;
        this.getAllUsers();
        this.setupSocketListeners();
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  getAllUsers(): void {
    if (this.roleID === 1) {
      this.userService.getPatientsWithSearch(this.search).subscribe({
        next: (data: User[]) => {
          this.users = data;
        },
        error: (error) => {
          console.error(error);
        }
      });
    }

    if (this.roleID === 2) {
      this.userService.getMedicsWithSearch(this.search).subscribe({
        next: (data: User[]) => {
          this.users = data;
        },
        error: (error) => {
          console.error(error);
        }
      });
    }
  }

  onSearchChange(search: string): void {
    this.search = search;
    this.getAllUsers();
  }

  setupSocketListeners() {
    this.socketService.onUserConnected().subscribe((user: User) => {
      console.log('User connected:', user);
    });

    this.socketService.onUserDisconnected().subscribe((user: User) => {
      console.log('User disconnected:', user);
    });
  }

  selectUser(user: User): void {
    this.selectedUser = user;
    this.socketService.changeChat(user.id_user.toString());
  }
}
