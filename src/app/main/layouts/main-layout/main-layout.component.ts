import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { AuthService } from '../../../auth/services/auth.service';
import { UserDataService } from '../../services/user-data.service';
import { RoleService } from '../../../auth/services/role.service';
import { io } from 'socket.io-client';
import { SocketWebService } from '../../services/socket/socket.service';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.css'],
})
export class MainLayoutComponent implements OnInit {
  //? Menu de opciones del icono de usuario
  items: MenuItem[] | undefined;

  //? Menu de opciones para vista de teléfono
  phoneMenu: MenuItem[] | undefined;

  //? Variables e Inyecciones
  private authService = inject(AuthService);
  private roleService = inject(RoleService);
  private cdr = inject(ChangeDetectorRef);
  private socketService = inject(SocketWebService);

  //? Variables de usuario
  isAdmin: boolean = false;
  roleUser: string = '';
  userInfo: string = '';
  nameUser: string = '';

  //? Constructor
  constructor() {}

  //? Método para cerrar sesión
  logOut() {
    this.authService.logOut();
    this.socketService.disconnect();
  }

  //? NgOnInit
  ngOnInit() {
    this.loadUserData();

    // Conecta al WebSocket al cargar el MainLayout
    const token = localStorage.getItem('token');
    if (token) {
      this.socketService.connect(token);
    }

    //? Menú de opciones del icono de usuario
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
            // Cerramos sesión
            command: () => {
              this.logOut();
            },
          },
        ],
      },
    ];
  }

  //? Método para cargar los datos del usuario
  loadUserData() {
    const roleId = localStorage.getItem('roleID')?.toString() || '';

    this.roleService.getRoleByID(Number(roleId)).subscribe((role) => {
      this.roleUser = role.role_name;
      this.setupPhoneMenu();
      this.cdr.detectChanges(); // Forzar la detección de cambios
    });

    this.isAdmin = localStorage.getItem('isAdmin') === 'true';
    this.userInfo = localStorage.getItem('user_name')?.toString() || '';
    this.nameUser = localStorage.getItem('nameUser')?.toString() || '';

    if (this.nameUser !== null) {
      this.nameUser = this.nameUser.split(' ')[0];
    } else {
      this.nameUser = '';
    }

    this.setupPhoneMenu(); // Asegúrate de configurar el menú después de cargar los datos
    this.cdr.detectChanges(); // Forzar la detección de cambios
  }

  //? Método para configurar el menú de opciones para vista de teléfono
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
        visible:
          this.roleUser.toLowerCase() === 'medico' ||
          this.roleUser.toLowerCase() === 'médico',
      },
      {
        label: 'Medicos',
        icon: 'pi pi-briefcase',
        routerLink: ['/main/medics'],
        visible:
          (this.roleUser.toLowerCase() === 'medico' ||
            this.roleUser.toLowerCase() === 'médico') &&
          this.isAdmin,
      },
      {
        label: 'Medicamentos',
        icon: 'pi pi-box',
        routerLink: ['/main/medicines'],
        visible:
          this.roleUser.toLowerCase() === 'medico' ||
          this.roleUser.toLowerCase() === 'médico',
      },
      {
        label: 'Teleconsultas',
        icon: 'pi pi-video',
        routerLink: ['/main/meetings'],
      },
      {
        label: 'Chats',
        icon: 'pi pi-comments',
        routerLink: ['/main/chats'],
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
  ngOnDestroy(): void {}
}
