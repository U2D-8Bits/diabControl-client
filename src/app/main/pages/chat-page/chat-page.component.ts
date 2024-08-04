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
  search: string = '';


  ngOnInit(): void {
    console.log(this.userID);

    this.userService.getUserById(this.userID)
    .subscribe({
      next: (data: User) => {
        this.userNames = data.user_name + ' ' + data.user_lastname;
        this.roleID = data.role_id;
        this.getAllUsers();
      },
      error: (error) => {
        console.error(error);
      }
    })

    console.log(this.userNames);
  }


  getAllUsers(): void {
    if(this.roleID === 1){
      this.userService.getPatientsWithSearch(this.search)
      .subscribe({
        next: (data: User[]) => {
          this.users = data;
        },
        error: (error) => {
          console.error(error);
        }
      })
    }

    if(this.roleID === 2){
      this.userService.getMedicsWithSearch(this.search)
      .subscribe({
        next: (data: User[]) => {
          this.users = data;
        },
        error: (error) => {
          console.error(error);
        }
      })
    }
  }

  onSearchChange(search: string): void{
    this.search = search;
    this.getAllUsers();
  }

  ngOnDestroy() : void {

  }

}
