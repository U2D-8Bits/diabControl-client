import { Component, inject, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Role, User } from '../../../auth/interfaces';
import { RoleService } from '../../../auth/services/role.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import Swal from 'sweetalert2';
import { Router } from '@angular/router';

import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.css',
})
export class ProfilePageComponent implements OnInit {
  constructor() {}



  //? Variables e Inyecciones
  private userService = inject(UserService);
  private roleService = inject(RoleService);
  private router = inject(Router);
  private fb = inject(FormBuilder);


  public roleUser = localStorage.getItem('role');
  private idUser!: number;
  public userData?: User;
  public roleData?: Role;
  public currentUserData?: User;
  public myForm!: FormGroup;
  public medics: User[] = [];


  ngOnInit(): void {
    console.log(`Profile Page Component initialized!`);





  //? Formulario de Usuario
   this.myForm = this.fb.group({
      user_name: ['', Validators.required],
      user_lastname: ['', Validators.required],
      user_email: ['', Validators.required],
      user_phone: ['', Validators.required],
      user_username: ['', Validators.required],
      user_password: ['', [Validators.required, Validators.minLength(6)]],
      user_ced: [0, Validators.required],
      role_id: [0, Validators.required],
      user_status: [true, Validators.required],
    });




    //? Obtenemos el ID del usuario
    this.idUser = Number(localStorage.getItem('ID'));





    //? Obtenemos los datos del usuario
    this.userService.getUserById(this.idUser).subscribe({
      next: (user) => {
        this.userData = user;
        this.getRoleData(user.role_id);
        this.chargeForm(user);
      },
      error: (error) => {
        console.error(`Error:`, error);
      },
    });

  }






  //? Funcion para actualizar los datos del usuario
  updateUserInfo() {
    Swal.fire({
      title: '¿Estás seguro de actualizar tus datos?',
      showDenyButton: true,
      confirmButtonText: `Si`,
      denyButtonText: `No`,
    }).then((result) => {
      if (result.isConfirmed) {
        const dataUser = this.myForm.value;
        this.userService.updateUser(this.idUser, dataUser).subscribe({
          next: (data) => {
            console.log('Data =>', data);
            Swal.fire('¡Tus datos se han actualizado!', '', 'success');
            setTimeout(() => {
              window.location.reload();
              this.router.navigate(['/main/profile']);
            }, 1000);
          },
          error: (error) => {
            console.error(`Error:`, error);
            Swal.fire('¡Tus datos no se han actualizado!', '', 'error');
          },
        });
      } else if (result.isDenied) {
        Swal.fire('¡Tus datos no se han actualizado!', '', 'info');
        this.myForm.reset(this.currentUserData);
        this.ngOnInit();
      }
    });
  }





  //? Funcion para cargar los datos del usuario en el formulario
  chargeForm(userData: User) {
    //* Se crea el formulario
    this.myForm = this.fb.group({
      user_name: [userData.user_name, Validators.required],
      user_lastname: [userData.user_lastname, Validators.required],
      user_email: [
        userData.user_email,
        [Validators.required, Validators.email],
      ],
      user_phone: [userData.user_phone, Validators.required],
      user_username: [userData.user_username, Validators.required],
      user_password: [
        userData.user_password,
        [Validators.required, Validators.minLength(6)],
      ],
      user_ced: [userData.user_ced, Validators.required],
      role_id: [userData.role_id, Validators.required],
      user_status: [userData.user_status, Validators.required],
    });

    //* Se guarda la data actual del usuario
    this.currentUserData = this.myForm.value;
  }





  //? Funcion para obtener los datos del rol
  getRoleData(role_id: number) {
    this.roleService.getRoleByID(role_id).subscribe({
      next: (role) => {
        this.roleData = role;
      },
      error: (error) => {
        console.error(`Error:`, error);
      },
    });
  }





  //? Funcion para destruir el componente
  ngOnDestroy(): void {
    console.log(`Profile Page Component destroyed!`);
  }
}
