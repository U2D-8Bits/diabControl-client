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
                detail: error.error.message,
              });
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



  ngOnInit(): void {
    console.log(`componente create-patient cargado`);
  }

  ngOnDestroy(): void {
    console.log(`componente create-patient destruido`);
  }
}
