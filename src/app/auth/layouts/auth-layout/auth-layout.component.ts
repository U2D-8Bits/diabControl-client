import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'auth-auth-layout',
  templateUrl: './auth-layout.component.html',
  styleUrl: './auth-layout.component.css'
})
export class AuthLayoutComponent implements OnInit {

    //? Menu de opciones para vista de telefono
    phoneMenu: MenuItem[] | undefined;


  constructor() { }

    ngOnInit(): void {
      this.setupPhoneMenu();
    }

    setupPhoneMenu() {
      this.phoneMenu = [
        {
          label: 'Inicio',
          icon: 'pi pi-home',
          routerLink: ['/auth/home'],
        },
        {
          label: 'Sobre Nosotros',
          icon: 'pi pi-info-circle',
          routerLink: ['/auth/about-us'],
        },
        {
          label: 'Iniciar Sesion',
          icon: 'pi pi-sign-in',
          routerLink: ['/auth/login'],
        },
      ];
    }

    ngOnDestroy(): void {
      
    }

}
