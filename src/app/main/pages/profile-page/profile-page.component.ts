import { Component, inject, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Role, User } from '../../../auth/interfaces';
import { RoleService } from '../../../auth/services/role.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';

import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { CreateMedicComponent } from '../../components/medic/create-medic/create-medic.component';
import { ViewMedicComponent } from '../../components/medic/view-medic/view-medic.component';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.css',
  providers: [DialogService],
})
export class ProfilePageComponent implements OnInit {


  //? Variables e Inyecciones
  ref: DynamicDialogRef | undefined;
  private userService = inject(UserService);
  private roleService = inject(RoleService);
  public dialigService = inject(DialogService);

  private router = inject(Router);
  private fb = inject(FormBuilder);
  
  public roleUser = localStorage.getItem('role');
  private idUser!: number;
  private idMedic!: number;
  public userData?: User;
  public roleData?: Role;
  public currentUserData?: User;
  public myForm!: FormGroup;
  public registeredMedics!: User[];

  presentYear = new Date().getFullYear();
  dateBirthYear = this.userData?.user_birthdate?.split('-')[0];
  ageUser: number = this.presentYear - Number(this.dateBirthYear);





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
      user_address: ['', Validators.required],
      user_birthdate: ['', Validators.required],
      user_age: [0, Validators.required],
      user_admin: [false, Validators.required],
      user_genre: ['', Validators.required],
      role_id: [0, Validators.required],
      user_status: [true, Validators.required],
    });



    //? Obtenemos el ID del usuario
    this.idUser = Number(localStorage.getItem('ID'));




    //? Obtenemos los datos del usuario
    this.userService.getUserById(this.idUser).subscribe({
      next: (user) => {
        this.userData = user;

        this.dateBirthYear = this.userData.user_birthdate.split('-')[0];
        this.ageUser = this.presentYear - Number(this.dateBirthYear);
        this.getRoleData(user.role_id);
        this.chargeForm(user);
        this.getAllMedics();
      },
      error: (error) => {
        console.error(`Error:`, error);
      },
    });
  }




  //? Metodo para obtener todos los medicos registrados en la base de datos
  getAllMedics() {
    this.userService.getAllMedics().subscribe({
      next: (medics) => {
        this.registeredMedics = medics.filter(
          (medic) => medic.id_user !== this.idUser
        );
        console.log('Medicos Registrados =>', this.registeredMedics);
      },
      error: (error) => {
        console.error(`Error:`, error);
      },
    });
  }


  getIdMedicToView(id: number){
    this.idMedic = id;
  }


  //? Metodo para agregar un medico nuevo
  showDialog(componentName: string, headerText: string) {

    if (componentName === 'create') {
      this.ref = this.dialigService.open(CreateMedicComponent, {
        header: headerText,
        breakpoints: { '960px': '500px', '640px': '100vw' },
        style: { 'max-width': '100vw', width: '80vw' },
        height: '80%',
        contentStyle: { overflow: 'auto' },
      });
    }

    if (componentName === 'view'){
      this.ref = this.dialigService.open(ViewMedicComponent, {
        header: headerText,
        breakpoints: { '960px': '500px', '640px': '100vw' },
        style: { 'max-width': '100vw', width: '80vw' },
        height: '80%',
        contentStyle: { overflow: 'auto' },
        data: {
          idMedic: this.idMedic,
        }
      });
    }
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
        console.log('Formulario de Usuario =>', this.myForm.value);
        const dataUser = this.myForm.value;
        this.userService.updateUser(this.idUser, dataUser).subscribe({
          next: (data) => {
            Swal.fire('¡Tus datos se han actualizado!', '', 'success');
            setTimeout(() => {
              window.location.reload();
              this.router.navigate(['/main/profile']);
            }, 1500);
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
      user_age: [this.ageUser, Validators.required],
      user_admin: [userData.user_admin, Validators.required],
      user_ced: [userData.user_ced, Validators.required],
      user_address: [userData.user_address, Validators.required],
      user_birthdate: [userData.user_birthdate, Validators.required],
      user_genre: [userData.user_genre, Validators.required],
      role_id: [userData.role_id, Validators.required],
      user_status: [userData.user_status, Validators.required],
    });

    console.log('Formulario de Usuario =>', this.myForm.value);

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





  //? Funcuncion para eliminar un medico
  deleteMedic(medicId: number) {
    Swal.fire({
      title: '¿Estas seguro?',
      text: 'No podras revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, borrar!',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.deleteUser(medicId).subscribe({
          next: (data) => {
            Swal.fire('¡El médico ha sido eliminado!', '', 'success');
            this.ngOnInit();
          },
          error: (error) => {
            console.error(`Error:`, error);
            Swal.fire('¡El médico no ha sido eliminado!', '', 'error');
          },
        });
      } else if (result.isDenied) {
        Swal.fire({
          title: 'Cancelado',
          text: 'El médico no ha sido eliminado',
          icon: 'info',
        });
      }
    });
  }





  //? Funcion para destruir el componente
  ngOnDestroy(): void {
    console.log(`Profile Page Component destroyed!`);
  }
}
