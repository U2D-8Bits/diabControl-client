import { Component, inject, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { HistoriesPageComponent } from '../../../pages/histories-page/histories-page.component';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { User } from '../../../../auth/interfaces/user.interface';
import { UserService } from '../../../services/user.service';
import { HistoryService } from '../../../services/history.service';
import { FormBuilder, Validators } from '@angular/forms';
import { History } from '../../../interfaces/history.interface';

@Component({
  selector: 'app-view-history',
  templateUrl: './view-history.component.html',
  styleUrl: './view-history.component.css',
  providers: [ConfirmationService, MessageService],
})
export class ViewHistoryComponent implements OnInit {
  //? Variables e Inyecciones

  ref: DynamicDialogRef | undefined;
  private historyComponent = inject(HistoriesPageComponent);

  private idPatient!: number;
  private idMedic!: number;
  private idHistory!: number;
  dataMedic!: User;
  medicNames: string = '';
  historyFormData!: History;

  private dynamicDialogConfig = inject(DynamicDialogConfig);
  private userService = inject(UserService);
  private historyService = inject(HistoryService);
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);
  private fb = inject(FormBuilder);

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
    current_illness: ['', [Validators.required]],
    diagnostic: ['', [Validators.required]],
    medic_indications: ['', [Validators.required]],
  });


  ngOnInit(): void {
    console.log(`Componente ViewHistory creado`);

    //? Obtenemos la data enviada a traves del Dialog de HistoryPageComponent
    this.idPatient = Number(this.dynamicDialogConfig.data.idPatient);
    this.idHistory = Number(this.dynamicDialogConfig.data.idHistory);
    this.idMedic = Number(localStorage.getItem('ID'));

    this.formatDate();
    this.getMedicData();
    this.getHistoryData();
  }

  //? Metodo para formatear la fecha actual en formato YYYY-MM-DD
  formatDate() {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth() + 1;
    const day = this.currentDate.getDate();

    this.currentDate = new Date(`${year}-${month}-${day}`);
  }

  //? Metodo para obtener la data del Medico
  getMedicData() {
    this.userService.getUserById(this.idMedic).subscribe({
      next: (data) => {
        this.dataMedic = data;
        this.medicNames = `${this.dataMedic.user_name} ${this.dataMedic.user_lastname}`;
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  //? Metodo para obtener la data de la Historia
  getHistoryData() {
    this.historyService.getHistoryById(this.idHistory)
    .subscribe({
      next: (data) => {

        this.historyForm.patchValue(data);
        this.historyForm.patchValue({
          medicoId: this.idMedic,
          pacienteId: this.idPatient,
        });

        //* Formulario de la data original
        this.historyFormData = data;

      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  //? Metodo para actualizar la Historia
  updateHistory(){

    const idHistory = this.idHistory;
    const historyData = this.historyForm.value;

    this.confirmationService.confirm({
      message: '¿Esta seguro que desea actualizar la Historia?',
      header: 'Actualizar Historia',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: 'pi pi-check',
      rejectIcon: 'pi pi-times',
      accept: () => {
        this.historyService.updateHistory(idHistory, historyData)
        .subscribe({
          next: (data) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Historia Actualizada',
              detail: 'La Historia ha sido actualizada con exito',
            });
            
            this.historyComponent.ngOnInit();
            this.historyForm.markAsPristine();
          },
          error: (error) => {
            console.error(error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error al Actualizar',
              detail: 'Ha ocurrido un error al actualizar la Historia',
            });
          }
        });
      },
      reject: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Actualización Cancelada',
          detail: 'La actualización de la Historia ha sido cancelada',
        });
      }
    
    })
  }


  //? Metodo para cancelar la actualización de la Historia
  calcelUpdate(){
    this.confirmationService.confirm({
      message: '¿Esta seguro que desea cancelar la actualización de la Historia?',
      header: 'Cancelar Actualización',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: 'pi pi-check',
      rejectIcon: 'pi pi-times',
      accept: () => {

        this.messageService.add({
          severity: 'info',
          summary: 'Actualización Cancelada',
          detail: 'La actualización de la Historia ha sido cancelada',
        });

        this.historyForm.setValue({
          medicoId: this.idMedic,
          pacienteId: this.idPatient,
          weight_patient: this.historyFormData.weight_patient,
          tall_patient: this.historyFormData.tall_patient,
          pulse_patient: this.historyFormData.pulse_patient,
          presure_patient: this.historyFormData.presure_patient,
          frequency_patient: this.historyFormData.frequency_patient,
          temperature_patient: this.historyFormData.temperature_patient,
          consult_reason: this.historyFormData.consult_reason,
          fisic_exam: this.historyFormData.fisic_exam,
          recipe: this.historyFormData.recipe,
          current_illness: this.historyFormData.current_illness,
          diagnostic: this.historyFormData.diagnostic,
          medic_indications: this.historyFormData.medic_indications,
        });

        //seteamos el historyForm como !dirty
        this.historyForm.markAsPristine();
      },
      reject: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Actualización no Cancelada',
          detail: 'La actualización de la Historia no ha sido cancelada',
        });
      }
    })
  }

  ngOnDestroy() {
    console.log(`Componente ViewHistory destruido`);
  }
}
