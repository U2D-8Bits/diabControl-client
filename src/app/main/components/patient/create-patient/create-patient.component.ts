import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { UserService } from '../../../services/user.service';
import { User } from '../../../../auth/interfaces';
import { PatientsPageComponent } from '../../../pages/patients-page/patients-page.component';

@Component({
  selector: 'app-create-patient',
  templateUrl: './create-patient.component.html',
  styleUrl: './create-patient.component.css',
  providers: [ConfirmationService, MessageService, DialogService],
})
export class CreatePatientComponent implements OnInit {
  constructor() {}

  //?Variables e Injecciones
  private fb = inject(FormBuilder);
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);
  private dialogService = inject(DialogService);
  private userService = inject(UserService);

  // Declramamos como variable el PatientsPageComponent para poder acceder a sus metodos
  private patientsPageComponent = inject(PatientsPageComponent);

  // variable para determinar que el formulario es invalido
  formInvalid: boolean = true;
  cancelAble: boolean = false;

  //? Formulario para crear un nuevo paciente
  myForm = this.fb.group({
    user_name: ['', Validators.required],
    user_lastname: ['', Validators.required],
    user_username: ['', Validators.required],
    user_password: ['', [Validators.required, Validators.minLength(6)]],
    user_email: ['', [Validators.required]],
    user_phone: ['', Validators.required],
    user_ced: [0, [Validators.required]],
    user_status: [true],
    role_id: [2],
  });

  //? Funcion para crear un nuevo paciente
  createPatient() {

    const patientData = this.myForm.value;

    //Validamos que el formulario sea valido
    if (this.myForm.valid) {
      this.formInvalid = true;
    }

    this.confirmationService.confirm({
      message: 'Esta seguro que desea crear un nuevo paciente?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: 'none',
      rejectIcon: 'none',
      rejectButtonStyleClass: 'p-button-text',
      acceptButtonStyleClass: 'p-button-text',
      accept: () => {
        this.userService.createUser(patientData as User)
          .subscribe({
            next: (data) => {
              console.log(data);
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Paciente creado correctamente',
              });
              this.patientsPageComponent.ngOnInit();
              this.myForm.reset();
            },
            error: (error) => {
              console.error(error);
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Error al crear paciente',
              });
              this.myForm.reset();
            },
          });
      },
      reject: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Info',
          detail: 'Creacion de paciente cancelada',
        });
      }
    });
  }

  //? Funcion para cancelar la creacion de un nuevo paciente
  cancelCreation() {
    this.confirmationService.confirm({
      message: 'Esta seguro que desea cancelar la creacion de un nuevo paciente?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: 'none',
      rejectIcon: 'none',
      rejectButtonStyleClass: 'p-button-text',
      acceptButtonStyleClass: 'p-button-text',
      accept: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Info',
          detail: 'Creacion de paciente cancelada',
        });
        this.myForm.reset();
      },
      reject: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Info',
          detail: 'Creacion de paciente no cancelada',
        });
      }
    });
  }

  verificarFormularioInvalido() {
    if (this.myForm.invalid) {
      console.log('El formulario es inválido.');
      // mostrar porque es invalido
      if (this.myForm.controls.user_name.invalid) {
        console.log('El campo nombre es requerido');
      }
      if (this.myForm.controls.user_lastname.invalid) {
        console.log('El campo apellido es requerido');
      }
      if (this.myForm.controls.user_username.invalid) {
        console.log('El campo usuario es requerido');
      }
      if (this.myForm.controls.user_password.invalid) {
        console.log('El campo contraseña es requerido');
      }
      if (this.myForm.controls.user_email.invalid) {
        console.log('El campo email es requerido');
      }
      if (this.myForm.controls.user_phone.invalid) {
        console.log('El campo telefono es requerido');
      }
      if (this.myForm.controls.user_ced.invalid) {
        console.log('El campo cedula es requerido');
      }
      if (this.myForm.controls.role_id.invalid) {
        console.log('El campo rol es requerido');
      }
      if(this.myForm.controls.user_status.invalid){
        console.log('El campo estado es requerido');
      }

    } else {
      console.log('El formulario es válido.');
    }
  }

  ngOnInit(): void {
    console.log(`componente create-patient cargado`);
    console.log("Formulario Valido =>", this.myForm.valid)
  }

  ngOnDestroy(): void {
    console.log(`componente create-patient destruido`);
  }
}
