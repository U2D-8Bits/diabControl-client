import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css',
})
export class MainLayoutComponent implements OnInit {

  //? Menu de opciones del icono de usuario
  items: MenuItem[] | undefined;

  //? Menu de opciones para vista de telefono
  phoneMenu: MenuItem[] | undefined;

  //? Variables e Injecciones
  private router = inject(Router);
  private authService = inject( AuthService);



  //? Variables de usuario de localstorage
  public roleUser = localStorage.getItem('role');
  public userInfo = localStorage.getItem('user_name');
  public nameUser = localStorage.getItem('nameUser');





  //? Constructor
  constructor() {
    if (this.nameUser !== null) {
      this.nameUser = this.nameUser.split(' ')[0];
    } else {
      this.nameUser = null;
    }
  }





  //? Metodo para Cerrar sesion 
  logOut(){
    console.log("Cerrar Sesión")
    this.authService.logOut();
  }




  //? NgOnInit
  ngOnInit() {

    //? Menu de opciones del icono de usuario
    this.items = [
      {
        label: 'Opciones',
        items: [
          {
            label: 'Mi Perfil',
            icon: 'pi pi-user',
            routerLink: ['/main/profile'],
          },
          {
            label: 'Cerrar Sesión',
            icon: 'pi pi-sign-out',
            // Cerramos sesion
            command: () => {
              this.logOut();
            },
          },
        ],
      },
    ];

    //? Menu de opciones para vista de telefono
    this.phoneMenu = [
      {
        label: 'Inicio',
        icon: 'pi pi-home',
        routerLink: ['/main/home'],
      },
      {
        label: 'Pacientes',
        icon: 'pi pi-users',
        routerLink: ['/main/patients'],
        visible: this.roleUser === 'medico',
      },
      {
        label: 'Informes',
        icon: 'pi pi-clipboard',
        routerLink: ['/main/informs'],
        visible: this.roleUser === 'medico',
      },
      {
        label: 'Formularios',
        icon: 'pi pi-file',
        routerLink: ['/main/forms'],
        visible: this.roleUser === 'paciente',
      },
      {
        label: 'Mi Perfil',
        icon: 'pi pi-user',
        routerLink: ['/main/profile'],
      },
      {
        label: 'Cerrar Sesión',
        icon: 'pi pi-sign-out',
        command: () => {
          this.logOut();
        },
      },
    ];
  }
}
