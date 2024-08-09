import { Component, inject, OnInit } from '@angular/core';
import { MessageService, ConfirmationService } from 'primeng/api';
import { MedicsPageComponent } from '../../../pages/medics-page/medics-page.component';
import { UserService } from '../../../services/user.service';
import { AbstractControl, FormBuilder, ValidationErrors, Validators } from '@angular/forms';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-create-medic',
  templateUrl: './create-medic.component.html',
  styleUrl: './create-medic.component.css',
  providers: [MessageService, ConfirmationService],
})
export class CreateMedicComponent implements OnInit {

  private medicPage = inject(MedicsPageComponent)
  private userService = inject(UserService)
  private messageService = inject(MessageService);
  private ref: DynamicDialogRef = inject(DynamicDialogRef);
  private confirmationService = inject(ConfirmationService);
  private fb = inject(FormBuilder);

  presentYear = new Date().getFullYear();
  ageUser!: number;
  cancelAble: boolean = false;

  medicForm = this.fb.group({
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
    role_id: [1],
  })

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


  createMedic(){
    const birthDateYear = this.medicForm.get('user_birthdate')?.value?.split('-')[0] || '';
    this.ageUser = this.presentYear - parseInt(birthDateYear);
    this.medicForm.patchValue({
      user_age: this.ageUser,
    });

    const medicData = this.medicForm.value;

    this.confirmationService.confirm({
      message: 'Está seguro que desea crear un nuevo médico?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: 'none',
      rejectIcon: 'none',
      acceptLabel: 'Si',
      rejectLabel: 'No',
      acceptButtonStyleClass: 'text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center disabled:bg-blue-400 pointer-events-auto',
      rejectButtonStyleClass: 'text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center  disabled:bg-red-400 pointer-events-auto mr-2', 
      accept: () => {
        this.userService.createUser(medicData)
        .subscribe({
          next: (resp: any) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: 'Médico creado correctamente',
            });

            this.medicPage.ngOnInit();
            setTimeout(() => {
              this.medicForm.reset();
              this.closeDialog();
            }, 1500);
          },
          error: (erResponse: any) => {
            if(erResponse.error.message === 'Ya existe un usuario asociado a ese nombre de usuario'){
              this.medicForm.get('user_username')?.reset();
            }
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'No se pudo crear el médico',
          });
          }
        })
      },
      reject: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Información',
          detail: 'Creación de médico cancelada',
        });
      }
    })
  }

  cancelCreation(){
    this.confirmationService.confirm({
      message: 'Está seguro que desea cancelar la creación del Médico?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: 'none',
      rejectIcon: 'none',
      acceptLabel: 'Si',
      rejectLabel: 'No',
      acceptButtonStyleClass: 'text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center disabled:bg-blue-400 pointer-events-auto',
      rejectButtonStyleClass: 'text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center  disabled:bg-red-400 pointer-events-auto mr-2', 
      accept: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Información',
          detail: 'creación de paciente cancelada',
        });
        this.closeDialog();
        this.medicForm.reset();
      },
      reject: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Información',
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

}
