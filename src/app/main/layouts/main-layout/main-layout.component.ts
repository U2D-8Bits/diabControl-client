import { ChangeDetectorRef, Component, effect, inject, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { AuthService } from '../../../auth/services/auth.service';
import { UserDataService } from '../../services/user-data.service';
import { RoleService } from '../../../auth/services/role.service';

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
  private authService = inject( AuthService);
  private roleService = inject( RoleService);


  //? Variables de usuario
  roleUser: string = '';
  userInfo: string = '';
  nameUser: string = '';





  //? Constructor
  constructor() {  }





  //? Metodo para Cerrar sesion 
  logOut(){
    console.log("Cerrar Sesión")
    this.authService.logOut();
  }




  //? NgOnInit
  ngOnInit() {

    this.loadUserData();
    console.log(`userInfo: ${this.userInfo}`);
    console.log(`nameUser: ${this.nameUser}`);

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
  }





  // //? Metodo para cargar los datos del usuario
  loadUserData() {
    const roleId = localStorage.getItem('roleID')?.toString() || '';

    this.roleService.getRoleByID(Number(roleId))
      .subscribe((role) => {
        this.roleUser = role.role_name;
        console.log(`Role: ${this.roleUser}`);
        this.setupPhoneMenu();
      });

    this.userInfo = localStorage.getItem('user_name')?.toString() || '';
    this.nameUser = localStorage.getItem('nameUser')?.toString() || '';

    if (this.nameUser !== null) {
      this.nameUser = this.nameUser.split(' ')[0];
    } else {
      this.nameUser = '';
    }
  }





  //? Metodo para configurar el menu de opciones para vista de telefono
  setupPhoneMenu() {
    this.phoneMenu = [
      {
        label: 'Inicio',
        icon: 'pi pi-home',
        routerLink: ['/main/dashboard'],
      },
      {
        label: 'Pacientes',
        icon: 'pi pi-users',
        routerLink: ['/main/patients'],
        visible: this.roleUser.toLowerCase() === 'medico' || this.roleUser.toLowerCase() === 'médico'
      },
      {
        label: 'Informes',
        icon: 'pi pi-clipboard',
        routerLink: ['/main/informs'],
        visible: this.roleUser.toLowerCase() === 'medico' || this.roleUser.toLowerCase() === 'médico'
      },
      {
        label: 'Formularios',
        icon: 'pi pi-file',
        routerLink: ['/main/forms'],
        visible: this.roleUser.toLowerCase() === 'paciente'
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





  //? Destroy del componente
  ngOnDestroy(): void {
    console.log(`Main Layout Component destroyed!`);
  }

}
