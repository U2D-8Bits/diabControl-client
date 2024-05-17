import { Component, inject, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Role, User } from '../../../auth/interfaces';
import { RoleService } from '../../../auth/services/role.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import Swal from 'sweetalert2';
import { MainLayoutComponent } from '../../layouts/main-layout/main-layout.component';

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
  private fb = inject(FormBuilder);
  private mainLayout = inject(MainLayoutComponent);
  private idUser!: number;

  myForm: FormGroup = this.fb.group({
    user_name: ['', Validators.required],
    user_lastname: ['', Validators.required],
    user_email: ['', Validators.required],
    user_phone: ['', Validators.required],
    user_username: ['', Validators.required],
    user_password: ['', Validators.required],
    user_ced: ['', Validators.required],
    role_id: ['', Validators.required],
    user_status: ['', Validators.required],
  });
  public userData?: User;
  public roleData?: Role;
  public currentUserData?: User;

  ngOnInit(): void {
    console.log(`Profile Page Component initialized!`);

    this.idUser = Number(localStorage.getItem('ID'));

    this.userService.getUserById(this.idUser).subscribe({
      next: (user) => {
        this.userData = user;
        this.getRoleData(user.role_id);
        this.chargeForm(user);
        console.log("Valores del formulario =>", this.myForm.dirty);
      },
      error: (error) => {
        console.error(`Error:`, error);
      },
    });

  }

  updateUserInfo(){
    Swal.fire({
      title: '¿Estás seguro de actualizar tus datos?',
      showDenyButton: true,
      confirmButtonText: `Si`,
      denyButtonText: `No`,
    }).then((result) => {
      if (result.isConfirmed) {
        const dataUser = this.myForm.value;
        this.userService.updateUser(this.idUser, dataUser)
          .subscribe({
            next: (data) => {
              console.log("Data =>", data);
              Swal.fire('¡Tus datos se han actualizado!', '', 'success');
              //Ajustamos los nuevos valores en el localStorage
              localStorage.setItem('nameUser', data.user_name.toString());
              localStorage.setItem('user_name', `${data.user_name} ${data.user_lastname}`);
              this.mainLayout.ngOnInit();
            },
            error: (error) => {
              console.error(`Error:`, error);
              Swal.fire('¡Tus datos no se han actualizado!', '', 'error');
            },
          })
      } else if (result.isDenied) {
        Swal.fire('¡Tus datos no se han actualizado!', '', 'info');
        this.myForm.reset(this.currentUserData);
        this.ngOnInit();
      }
    });
  }


  chargeForm(userData: User){

    this.myForm.valueChanges.subscribe( value => {
      console.log("Formulario =>", value);
    })

        //* Se crea el formulario
        this.myForm = this.fb.group({
          user_name: [userData.user_name, Validators.required],
          user_lastname: [userData.user_lastname, Validators.required],
          user_email: [userData.user_email, [Validators.required, Validators.email]],
          user_phone: [userData.user_phone, Validators.required],
          user_username: [userData.user_username, Validators.required],
          user_password: [userData.user_password, [Validators.required, Validators.minLength(6)]],
          user_ced: [userData.user_ced, Validators.required],
          role_id: [userData.role_id, Validators.required],
          user_status: [userData.user_status, Validators.required],
        })

        this.currentUserData = this.myForm.value;
  }



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

  ngOnDestroy(): void {
    console.log(`Profile Page Component destroyed!`);
  }
}
