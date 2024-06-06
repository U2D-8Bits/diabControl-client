import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { User } from '../../../../auth/interfaces/user.interface';
import { UserService } from '../../../services/user.service';
import { HistoryService } from '../../../services/history.service';
import { HistoriesPageComponent } from '../../../pages/histories-page/histories-page.component';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-create-history',
  templateUrl: './create-history.component.html',
  styleUrl: './create-history.component.css',
  providers: [ConfirmationService, MessageService],
})
export class CreateHistoryComponent implements OnInit {


  //? Variables e Inyecciones
  ref: DynamicDialogRef | undefined;
  private historyComponent = inject( HistoriesPageComponent )

  private idPatient!: number;
  private idMedic!: number;
  dataMedic!: User;
  medicNames: string = '';

  private dynamicDialogConfing = inject( DynamicDialogConfig)
  private userService = inject( UserService );
  private historyService = inject( HistoryService );
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);
  private fb = inject( FormBuilder );

  //? Establecemos una variable con la fecha actual
  currentDate: Date = new Date();
   
  historyForm = this.fb.group({
    medicoId: [this.idMedic],
    pacienteId: [this.idPatient],
    weight_patient: [0],
    tall_patient: [0],
    pulse_patient: [0],
    presure_patient: [0],
    frequency_patient: [0],
    temperature_patient: [0],
    consult_reason: ['', [Validators.required]],
    fisic_exam: ['', [Validators.required]],
    recipe: ['', [Validators.required]],
    current_illness: ['',[Validators.required]],
    diagnostic: ['', [Validators.required]],
    medic_indications: ['', [Validators.required]]
  });


  ngOnInit(){
    console.log(`Componente CreateHistory creado`);

    //? Obtenemos la data enviada a traves del Diago de HistoryPageComponent
    this.idPatient = this.dynamicDialogConfing.data.idPatient;
    this.idMedic = Number( localStorage.getItem('ID') );

    this.formatDate();
    this.getMedicData();

  }

  //? Metodo para formatear la fecha actual en formato YYYY-MM-DD
  formatDate(){
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth() + 1;
    const day = this.currentDate.getDate();

    this.currentDate = new Date(`${year}-${month}-${day}`);
  }


  //? Metodo para obtener la data del Medico
  getMedicData(){
    this.userService.getUserById( this.idMedic )
    .subscribe({
      next: (data) => {
        this.dataMedic = data;
        console.log(`Data del Medico =>`, this.dataMedic);
        this.medicNames = `${this.dataMedic.user_name} ${this.dataMedic.user_lastname}`;
      },
      error: (error) => {
        console.error(error);
      }
    });
  }


  //? Metodo para crear la Historia Clinica
  createHistory(){
    
    this.historyForm.patchValue({
      medicoId: this.idMedic,
      pacienteId: Number(this.idPatient)
    });
    console.log(`Valores del Formulario a Guardar =>`, this.historyForm.value);
    const historyData = this.historyForm.value;

    this.confirmationService.confirm({
        message: 'Está seguro que desea crear esta Historia Clinica?',
        header: 'Confirmation',
        icon: 'pi pi-exclamation-triangle',
        acceptIcon: 'none',
        rejectIcon: 'none',
        rejectButtonStyleClass: 'p-button-danger, padding: 10px; borer-radius: 5px; border: 1px solid red;',
        acceptButtonStyleClass: 'p-button-success',
        accept: () => {

          this.historyService.crateHistory( historyData )
          .subscribe({
            next: (data) => {
              console.log(data);
              console.log(`Valores de Data =>`, data);
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Historia Clinica creada correctamente',
              });
              this.historyComponent.ngOnInit();
              this.historyForm.setValue({
                medicoId: this.idMedic,
                pacienteId: this.idPatient,
                weight_patient: 0,
                tall_patient: 0,
                pulse_patient: 0,
                presure_patient: 0,
                frequency_patient: 0,
                temperature_patient: 0,
                consult_reason: '',
                fisic_exam: '',
                recipe: '',
                current_illness: '',
                diagnostic: '',
                medic_indications: ''
              });
              this.ref?.close();
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
            detail: 'Creacion de Historia Clinica cancelada',
          });
        }
      });
  }


  //? Metodo para cancelar la creacion de la Historia Clinica
  cancelHistory(){
    this.confirmationService.confirm({
      message: 'Está seguro que desea cancelar la creación de la Historia Clinica?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: 'none',
      rejectIcon: 'none',
      rejectButtonStyleClass: 'p-button-text',
      acceptButtonStyleClass: 'p-button-text',
      accept: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Info',
          detail: 'Creacion de Historia Clinica cancelada',
        });
        this.historyForm.setValue({
          medicoId: this.idMedic,
          pacienteId: this.idPatient,
          weight_patient: 0,
          tall_patient: 0,
          pulse_patient: 0,
          presure_patient: 0,
          frequency_patient: 0,
          temperature_patient: 0,
          consult_reason: '',
          fisic_exam: '',
          recipe: '',
          current_illness: '',
          diagnostic: '',
          medic_indications: ''
        });
      },
      reject: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Info',
          detail: 'Creacion de Historia Clinica no cancelada',
        });
      }
    });
  }

  ngOnDestroy(){
    console.log(`Componente CreateHistory destruido`);
  }

}
