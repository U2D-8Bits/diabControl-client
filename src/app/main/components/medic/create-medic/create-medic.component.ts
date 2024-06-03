import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { UserService } from '../../../services/user.service';
import { User } from '../../../../auth/interfaces';

@Component({
  selector: 'main-create-medic',
  templateUrl: './create-medic.component.html',
  styleUrl: './create-medic.component.css',
  providers: [ConfirmationService, MessageService, DialogService],
})
export class CreateMedicComponent implements OnInit {
  constructor() {}

  //? Variables e Inyecciones
  private fb = inject(FormBuilder);
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);
  private dialogService = inject(DialogService);
  private userService = inject(UserService);

  //* Formulario con Valores por defecto
  formDefault = this.fb.group({
    user_name: ['', Validators.required],
    user_lastname: ['', Validators.required],
    user_username: ['', Validators.required],
    user_password: ['', [Validators.required, Validators.minLength(6)]],
    user_email: ['', [Validators.required]],
    user_phone: ['', Validators.required],
    user_address: ['', [Validators.required]],
    user_birthdate: ['', [Validators.required]],
    user_genre: ['', [Validators.required]],
    user_ced: [0, [Validators.required]],
    user_status: [true],
    role_id: [1],
  });

  //* variable para determinar que el formulario es invalido
  cancelAble: boolean = false;

  //? Formulario para crear un nuevo medico
  myForm = this.fb.group({
    user_name: ['', Validators.required],
    user_lastname: ['', Validators.required],
    user_username: ['', Validators.required],
    user_password: ['', [Validators.required, Validators.minLength(6)]],
    user_email: ['', [Validators.required]],
    user_phone: ['', Validators.required],
    user_address: ['', [Validators.required]],
    user_birthdate: ['', [Validators.required]],
    user_genre: ['', [Validators.required]],
    user_ced: [0, [Validators.required]],
    user_status: [true],
    role_id: [1],
  });

  //?

  //? Funcion para crear un nuevo medico
  createMedic() {
    const medicData = this.myForm.value;

    this.confirmationService.confirm({
      message: 'Está seguro que desea crear un nuevo médico?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: 'none',
      rejectIcon: 'none',
      rejectButtonStyleClass: 'p-button-text',
      acceptButtonStyleClass: 'p-button-text',
      accept: () => {
        this.userService.createUser(medicData).subscribe({
          next: (data) => {
            console.log(data);
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Médico creado correctamente',
            });
            
            //? Volvemos los valores del formulario a su estado por defecto
            this.myForm = this.formDefault;
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
          detail: 'Creaciónn de médico cancelada',
        });
      },
    });
  }

  //? Funcion para cancelar la creacion de un nuevo paciente
  cancelCreation() {
    this.confirmationService.confirm({
      message: 'Está seguro que desea cancelar la creación de un nuevo médico?',
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
          detail: 'Creación de médico cancelada',
        });
        this.myForm.reset();
      },
      reject: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Info',
          detail: 'Creación de médico no cancelada',
        });
      },
    });
  }

  ngOnInit(): void {
    console.log(`CreateMedicComponent initialized`);
  }

  ngOnDestroy(): void {
    console.log(`CreateMedicComponent destroyed`);
  }
}
