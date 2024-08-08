import { Component, inject, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { MedicsPageComponent } from '../../../pages/medics-page/medics-page.component';
import { UserService } from '../../../services/user.service';
import {
  AbstractControl,
  FormBuilder,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { User } from '../../../../auth/interfaces';

@Component({
  selector: 'app-view-medic',
  templateUrl: './view-medic.component.html',
  styleUrl: './view-medic.component.css',
  providers: [ConfirmationService, MessageService],
})
export class ViewMedicComponent implements OnInit {
  private medicPage = inject(MedicsPageComponent);
  private userService = inject(UserService);
  private messageService = inject(MessageService);
  private ref: DynamicDialogRef = inject(DynamicDialogRef);
  private confirmationService = inject(ConfirmationService);
  private dynamicDialogConfig = inject(DynamicDialogConfig);
  private fb = inject(FormBuilder);

  idMedic: number = 0;
  presentYear = new Date().getFullYear();
  userAge!: number;

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
  });

  defaultMedicForm = this.fb.group({
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
  });

  getMedicData() {
    this.userService.getUserById(this.idMedic).subscribe({
      next: (medicData: User) => {
        this.medicForm.patchValue(medicData);
        this.defaultMedicForm.patchValue(medicData);
        this.userAge =
          new Date().getFullYear() -
          new Date(medicData.user_birthdate).getFullYear();
      },
      error: (error: any) => {
        console.error('Error fetching medic data:', error);
      },
    });
  }

  updateMedic() {
    const birthDateYear =
      this.medicForm.get('user_birthdate')?.value?.split('-')[0] || '';
    this.userAge = this.presentYear - parseInt(birthDateYear);

    this.medicForm.patchValue({
      user_age: this.userAge,
    });

    this.confirmationService.confirm({
      message: 'Está seguro que desea actualizar los datos del médico?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: 'none',
      rejectIcon: 'none',
      acceptLabel: 'Si',
      rejectLabel: 'No',
      acceptButtonStyleClass: 'text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center disabled:bg-blue-400 pointer-events-auto',
      rejectButtonStyleClass: 'text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center  disabled:bg-red-400 pointer-events-auto mr-2', 
      accept: () => {
        this.userService
          .updateUser(this.idMedic, this.medicForm.value)
          .subscribe({
            next: () => {
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Médico actualizado',
              });
              setTimeout(() => {
                this.ref.close();
                this.medicPage.ngOnInit();
              }, 1500);
            },
            error: (error: any) => {
              console.error('Error updating medic:', error);
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Error al actualizar médico',
              });
            },
          });
      },
      reject: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Rejected',
          detail: 'La solicitud ha sido rechazado',
        });
      },
    });
  }


  cancelUpdate(){
    this.confirmationService.confirm({
      message: 'Está seguro que desea cancelar la actualización del Médico?',
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
          severity: 'info',
          summary: 'Cancelado',
          detail: 'Se cancelo la actualización del Médico'
        })
        this.medicForm.patchValue(this.defaultMedicForm.value);
        setTimeout(() => {
          this.closeModal();
          this.medicPage.ngOnInit();
        }, 1500)
      },
      reject: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Rechazado',
          detail: 'Se cancelo la cancelación de la actualización del Médico'
        })
      }
    })
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
    const evenSum = digits
      .filter((_: any, index: number) => index % 2 === 1)
      .reduce((a: any, b: any) => a + b, 0);
    const oddSum = digits
      .filter((_: any, index: number) => index % 2 === 0)
      .map((d: number) => (d * 2 > 9 ? d * 2 - 9 : d * 2))
      .reduce((a: any, b: any) => a + b, 0);
    const totalSum = evenSum + oddSum;
    const verifierCalc = (10 - (totalSum % 10)) % 10;

    if (verifier !== verifierCalc) {
      return { invalidVerifier: true };
    }

    return null;
  }

  closeModal() {
    this.ref.close();
  }

  ngOnInit(): void {
    this.idMedic = this.dynamicDialogConfig.data.id_user;
    this.getMedicData();
  }

  ngOnDestroy(): void {}
}
