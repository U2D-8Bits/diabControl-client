import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { UserService } from '../../../services/user.service';
import { PatientsPageComponent } from '../../../pages/patients-page/patients-page.component';

@Component({
  selector: 'app-create-patient',
  templateUrl: './create-patient.component.html',
  styleUrl: './create-patient.component.css',
  providers: [ConfirmationService, MessageService, DialogService],
})
export class CreatePatientComponent implements OnInit {
  constructor() {}

  private fb = inject(FormBuilder);
  private ref: DynamicDialogRef = inject(DynamicDialogRef);
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);
  private dialogService = inject(DialogService);
  private userService = inject(UserService);

  presentYear = new Date().getFullYear();
  ageUser!: number;

  private patientsPageComponent = inject(PatientsPageComponent);

  cancelAble: boolean = false;

  myForm = this.fb.group({
    user_username: ['', Validators.required],
    user_status: [true],
    user_phone: ['', Validators.required],
    user_password: ['', [Validators.required, Validators.minLength(6)]],
    user_name: ['', Validators.required],
    user_lastname: ['', Validators.required],
    user_genre: ['', Validators.required],
    user_email: ['', [Validators.required, Validators.email]],
    user_ced: ['', [Validators.required, this.ecuadorianCedulaValidator]],
    user_birthdate: ['', [Validators.required, this.futureDateValidator]],
    user_age: [0, Validators.required],
    user_admin: [false],
    user_address: ['', Validators.required],
    role_id: [2],
  });

  createPatient() {
    const birthDateYear = this.myForm.get('user_birthdate')?.value?.split('-')[0] || '';
    this.ageUser = this.presentYear - parseInt(birthDateYear);
    this.myForm.patchValue({
      user_age: this.ageUser,
    });

    const patientData = this.myForm.value;

    this.confirmationService.confirm({
      message: 'Está seguro que desea crear un nuevo paciente?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: 'none',
      rejectIcon: 'none',
      rejectButtonStyleClass: 'p-button-text',
      acceptButtonStyleClass: 'p-button-text',
      accept: () => {
        this.userService.createUser(patientData)
          .subscribe({
            next: (data) => {
              this.messageService.add({
                severity: 'success',
                summary: 'Éxito',
                detail: 'Paciente creado correctamente',
              });

              this.patientsPageComponent.ngOnInit();
              this.myForm.reset();
              setTimeout(() => {
                this.closeDialog();
              }, 1200)
            },
            error: (error) => {
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

  cancelCreation() {
    this.confirmationService.confirm({
      message: 'Está seguro que desea cancelar la creación de un nuevo paciente?',
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
          detail: 'creación de paciente cancelada',
        });
        this.closeDialog();
        this.myForm.reset();
      },
      reject: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Info',
          detail: 'creación de paciente no cancelada',
        });
      }
    });
  }

  closeDialog() {
    this.ref.close();
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }

  futureDateValidator(control: AbstractControl): ValidationErrors | null {
    const selectedDate = new Date(control.value);
    const today = new Date();
    if (selectedDate > today) {
      return { futureDate: true };
    }
    return null;
  }

  ecuadorianCedulaValidator(control: AbstractControl): ValidationErrors | null {
    const cedula = control.value;
    if (!cedula || cedula.length !== 10) {
      return { invalidLength: true };
    }

    const provinceCode = parseInt(cedula.substring(0, 2), 10);
    if (provinceCode < 1 || (provinceCode > 24 && provinceCode !== 30)) {
      return { invalidProvinceCode: true };
    }

    const digits = cedula.split('').map(Number);
    const verifier = digits.pop();
    const evenSum = digits.filter((_: any, index: number) => index % 2 === 1).reduce((a: any, b: any) => a + b, 0);
    const oddSum = digits.filter((_: any, index: number) => index % 2 === 0).map((d: number) => d * 2 > 9 ? d * 2 - 9 : d * 2).reduce((a: any, b: any) => a + b, 0);
    const totalSum = evenSum + oddSum;
    const verifierCalc = (10 - (totalSum % 10)) % 10;

    if (verifier !== verifierCalc) {
      return { invalidVerifier: true };
    }

    return null;
  }
}
