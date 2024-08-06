import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { RoleService } from '../../../auth/services/role.service';
import { User } from '../../../auth/interfaces/user.interface';// Importa el servicio de sockets
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
  messages: any[] = [];
  newMessage: string = '';
  selectedUser: User | null = null;
  currentUser!: User;

  constructor(
    private userService: UserService,
    private roleService: RoleService,
    private socketService: SocketWebService // Inyecta el servicio de sockets
  ) {}

  ngOnInit(): void {
    this.userService.getUserById(this.userID).subscribe({
      next: (data: User) => {
        this.userNames = data.user_name + ' ' + data.user_lastname;
        this.roleID = data.role_id;
        this.currentUser = data; // Asigna el usuario actual
        this.getAllUsers();
        this.setupSocketListeners(); // Configura los listeners de los sockets
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
      // Manejar la conexión del usuario
    });

    this.socketService.onUserDisconnected().subscribe((user: User) => {
      console.log('User disconnected:', user);
      // Manejar la desconexión del usuario
    });
  }

  selectUser(user: User): void {
    this.selectedUser = user;
  }
}
