import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { UserDataService } from '../../../services/user-data.service';
import { User } from '../../../../auth/interfaces';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { PatientsPageComponent } from '../../../pages/patients-page/patients-page.component';
import { DynamicDialogComponent } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-view-patient',
  templateUrl: './view-patient.component.html',
  styleUrl: './view-patient.component.css',
  providers: [ConfirmationService, MessageService]
})
export class ViewPatientComponent implements OnInit {
  @ViewChild('inputForm') inputForm!: ElementRef;

  constructor(){}

  //? Variables e Injecciones
  private userService = inject(UserService);
  private userDataService = inject(UserDataService);
  private ref: DynamicDialogComponent = inject(DynamicDialogComponent);
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);
  private patientsPageComponent = inject(PatientsPageComponent);
  private fb = inject(FormBuilder);

  private patienFormData!: User;
  public patientData?: User;
  public userID!: number;
  myForm!: FormGroup;
  presentYear = new Date().getFullYear();
  userAge!: number;





  ngOnInit(): void {

    //* Se obtiene el ID del usuario
    this.userDataService.currentUserId
      .subscribe({
        next: (data) => {
          this.userID = data;
        },
        error: (error) => {
          console.error("Error al obtener el ID del paciente:", error);
        }
      })
    




    //* Se crea el formulario
    this.myForm = this.fb.group({
      id_user: [this.userID, Validators.required],
      user_name: ['', Validators.required],
      user_lastname: ['', Validators.required],
      user_email: ['', Validators.required],
      user_phone: ['', Validators.required],
      user_address: ['', Validators.required],
      user_genre: ['', Validators.required],
      user_birthdate: ['', [Validators.required, this.futureDateValidator]],
      user_age: [0, Validators.required],
      user_admin: [false],
      user_username: ['', Validators.required],
      user_password: ['', Validators.required],
      user_ced: ['', [Validators.required, this.ecuadorianCedulaValidator]],
      role_id: [2, Validators.required],
      user_status: [true, Validators.required],
    })




  
    //* Se obtiene la información del paciente y se asigna al formulario
    this.userService.getUserById(this.userID)
      .subscribe({
        next: (data) => {
          this.patientData = data;
          this.myForm.patchValue({
            user_name: this.patientData.user_name,
            user_lastname: this.patientData.user_lastname,
            user_email: this.patientData.user_email,
            user_phone: this.patientData.user_phone,
            user_address: this.patientData.user_address,
            user_genre: this.patientData.user_genre,
            user_age: this.patientData.user_age,
            user_admin: this.patientData.user_admin,
            user_birthdate: this.patientData.user_birthdate,
            user_username: this.patientData.user_username,
            user_password: this.patientData.user_password,
            user_ced: this.patientData.user_ced,
          })

          this.patienFormData = this.myForm.value;
        },
        error: (error) => {
          console.error("Error al obtener los datos del paciente:", error);
        }
      })

  }





  //? Metodo para acutalizar paciente
  updatePatient(){

    const birthDateYear = this.myForm.get('user_birthdate')?.value?.split('-')[0] || '';
    this.userAge = this.presentYear - parseInt(birthDateYear);

    this.myForm.patchValue({
      user_age: this.userAge,
    });

    const {id_user, ...patientData} = this.myForm.value;

    this.confirmationService.confirm({
      message: 'Está seguro que desea actualizar los datos del paciente?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: 'none',
      rejectIcon: 'none',
      acceptLabel: 'Si',
      rejectLabel: 'No',
      acceptButtonStyleClass: 'text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center disabled:bg-blue-400 pointer-events-auto',
      rejectButtonStyleClass: 'text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center  disabled:bg-red-400 pointer-events-auto mr-2', 
      accept: () => {
        this.userService.updateUser(this.userID,patientData)
          .subscribe({
            next: (data) => {
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Paciente actualizado correctamente',
              });
              this.patientsPageComponent.ngOnInit();
              this.ngOnInit();
              setTimeout(() => {
                this.closeModal();
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
          detail: 'Actualización de paciente cancelada',
        });
        this.myForm.reset(this.patienFormData);
      }
    });
    }





  //? Cancelar la edición del paciente
  cancelUpdate(){
    this.confirmationService.confirm({
      message: 'Esta seguro que desea cancelar la edición del paciente?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: 'none',
      rejectIcon: 'none',
      acceptLabel: 'Si',
      rejectLabel: 'No',
      acceptButtonStyleClass: 'text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center disabled:bg-blue-400 pointer-events-auto',
      rejectButtonStyleClass: 'text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center  disabled:bg-red-400 pointer-events-auto mr-2', 
      accept: () => {
        this.myForm.reset(this.patienFormData);
        this.messageService.add({
          severity: 'error',
          summary: 'Info',
          detail: 'Edición de paciente cancelada',
        });
        setTimeout(() => {
          this.closeModal();
        }, 1200)
      },
      reject: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Info',
          detail: 'Edición de paciente no cancelada',
        });
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
    const evenSum = digits.filter((_: any, index: number) => index % 2 === 1).reduce((a: any, b: any) => a + b, 0);
    const oddSum = digits.filter((_: any, index: number) => index % 2 === 0).map((d: number) => d * 2 > 9 ? d * 2 - 9 : d * 2).reduce((a: any, b: any) => a + b, 0);
    const totalSum = evenSum + oddSum;
    const verifierCalc = (10 - (totalSum % 10)) % 10;

    if (verifier !== verifierCalc) {
      return { invalidVerifier: true };
    }

    return null;
  }
  

  //? Metodo para cerrar al modal
  closeModal(){
    this.ref.close();
  }



  //? Destructor for the component
  ngOnDestroy(): void {
  }

}
