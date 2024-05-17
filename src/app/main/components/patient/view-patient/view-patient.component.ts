import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { UserDataService } from '../../../services/user-data.service';
import { User } from '../../../../auth/interfaces';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { PatientsPageComponent } from '../../../pages/patients-page/patients-page.component';

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
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);
  private patientsPageComponent = inject(PatientsPageComponent);
  private fb = inject(FormBuilder);

  private patienFormData!: User;
  public patientData?: User;
  public userID!: number;
  myForm!: FormGroup;





  ngOnInit(): void {
    //* Mensaje que se muestra en consola cuando el componente se inicia
    console.log('El componente ViewPatientComponent se inició');





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
      user_username: ['', Validators.required],
      user_password: ['', Validators.required],
      user_ced: ['', Validators.required],
      role_id: [2, Validators.required],
      user_status: [true, Validators.required],
    })




  
    //* Se obtiene la información del paciente
    this.userService.getUserById(this.userID)
      .subscribe({
        next: (data) => {
          this.patientData = data;
          // Se asignan los valores al formulario
          this.myForm.patchValue({
            user_name: this.patientData.user_name,
            user_lastname: this.patientData.user_lastname,
            user_email: this.patientData.user_email,
            user_phone: this.patientData.user_phone,
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
    console.log("Valor del formulario:", this.myForm.value);

    const {id_user, ...patientData} = this.myForm.value;

    this.confirmationService.confirm({
      message: 'Esta seguro que desea actualizar los datos del paciente?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: 'pi pi-check',
      rejectIcon: 'pi pi-times',
      acceptButtonStyleClass: 'p-button-success',
      rejectButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.userService.updateUser(this.userID,patientData)
          .subscribe({
            next: (data) => {
              console.log(data);
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Paciente actualizado correctamente',
              });
              this.patientsPageComponent.ngOnInit();
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
          detail: 'Actualizacion de paciente cancelada',
        });
        // Reiniciamos el formulario con los valores originales
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
      acceptIcon: 'pi pi-check',
      rejectIcon: 'pi pi-times',
      acceptButtonStyleClass: 'p-button-success',
      rejectButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.myForm.reset(this.patienFormData);
      },
      reject: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Info',
          detail: 'Edición de paciente cancelada',
        });
      }
    })
  }
  




  //? Destructor for the component
  ngOnDestroy(): void {
    //* Mensaje que se muestra en consola cuando el componente se destruye
    console.log('El componente ViewPatientComponent se destruyó');
  }

}
