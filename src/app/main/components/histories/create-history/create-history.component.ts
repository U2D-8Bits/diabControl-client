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
  private dataMedic!: User;

  private dynamicDialogConfing = inject( DynamicDialogConfig)
  private userService = inject( UserService );
  private historyService = inject( HistoryService );
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);
  private fb = inject( FormBuilder );
   
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

  }


  //? Metodo para crear la Historia Clinica
  createHistory(){
    console.log(`Valores del Formulario a Guardar =>`, this.historyForm.value);
    const historyData = this.historyForm.value;

    this.confirmationService.confirm({
        message: 'Está seguro que desea crear esta Historia Clinica?',
        header: 'Confirmation',
        icon: 'pi pi-exclamation-triangle',
        acceptIcon: 'none',
        rejectIcon: 'none',
        //Colocamos un background rojo al boton de cancelar con un padding de 1rem y borde de 1px
        rejectButtonStyleClass: 'p-button-danger',
        acceptButtonStyleClass: 'p-button-success',
        accept: () => {

          this.historyService.crateHistory( historyData )
          .subscribe({
            next: (data) => {
              console.log(data);
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Historia Clinica creada correctamente',
              });
              this.historyComponent.ngOnInit();
              this.historyForm.reset();
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
        this.ref?.close();
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
