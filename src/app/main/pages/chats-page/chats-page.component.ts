import { Component, inject, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../../auth/interfaces';

@Component({
  selector: 'app-chats-page',
  templateUrl: './chats-page.component.html',
  styleUrl: './chats-page.component.css'
})
export class ChatsPageComponent implements OnInit{


  constructor() { }

  //? Variables e Inyección de dependencias
  private userService = inject( UserService)

  public contacts: User[] = []


  //? NgOnInit
  ngOnInit(): void {
    console.log(`ChatsPageComponent initialized`)

    let roleName = localStorage.getItem('role')

    if (roleName !== null) {
      this.getContacts(roleName)
    }
  }


  //? Metodo para obtener los contactos dependiendo del rol del usuario
  getContacts(roleName: string){

    //* Si el usuario es un medico se obtienen todos los pacientes
    if( roleName === 'medico'){
      this.userService.getAllPatients()
        .subscribe({
          next: (patients) => {
            this.contacts = patients
            console.log(this.contacts)
          },
          error: (err) => {console.log(err)}
        })
    }

    //* Si el usuario es un paciente se obtienen todos los medicos
    if( roleName === 'paciente'){
      this.userService.getAllMedics()
      .subscribe({
        next: (medics) => {
          this.contacts = medics
          console.log(this.contacts)
        },
        error: (err) => {console.log(err)}
      })}
    }



  //? NgOnDestroy
  ngOnDestroy(): void {
    console.log(`ChatsPageComponent destroyed`)
  }

}
