import { Component, inject, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { RoleService } from '../../../auth/services/role.service';
import { User } from '../../../auth/interfaces/user.interface';

@Component({
  selector: 'app-chat-page',
  templateUrl: './chat-page.component.html',
  styleUrl: './chat-page.component.css'
})
export class ChatPageComponent implements OnInit {

  private userService = inject(UserService);
  private roleService = inject(RoleService);

  roleID: number = 0;
  userID: number = Number( localStorage.getItem('ID') );
  userNames: string = '';
  users: User[] = [];


  ngOnInit(): void {
    console.log(this.userID);

    this.userService.getUserById(this.userID)
    .subscribe({
      next: (data: User) => {
        this.userNames = data.user_name + ' ' + data.user_lastname;
        this.roleID = data.role_id;
      },
      error: (error) => {
        console.error(error);
      }
    })

    console.log(this.userNames);
  }


  getAllUsers() {
    
  }

  ngOnDestroy() : void {

  }

}
