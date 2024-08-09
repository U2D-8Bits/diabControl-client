import { Component, inject, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { HistoriesPageComponent } from '../../../pages/histories-page/histories-page.component';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { User } from '../../../../auth/interfaces/user.interface';
import { UserService } from '../../../services/user.service';
import { HistoryService } from '../../../services/history.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { History } from '../../../interfaces/history.interface';
import { Medicine } from '../../../interfaces/Medicines/medicines.interface';
import { MedicineService } from '../../../services/meds/medicines.service';

@Component({
  selector: 'app-view-history',
  templateUrl: './view-history.component.html',
  styleUrls: ['./view-history.component.css'],
  providers: [ConfirmationService, MessageService],
})
export class ViewHistoryComponent implements OnInit {
  private ref: DynamicDialogRef = inject(DynamicDialogRef);
  private historyComponent = inject(HistoriesPageComponent);
  private idPatient!: number;
  private idMedic!: number;
  private idHistory!: number;

  dataMedic!: User;
  medicNames: string = '';
  historyFormData!: History;
  medicines: Medicine[] = [];
  fenotypes: any[] = [
    { name_fenotype: 'Picoteador / Emocional' },
    { name_fenotype: 'Compulsivo' },
    { name_fenotype: 'Hiperfágico' },
    { name_fenotype: 'Hedónico' },
    { name_fenotype: 'Desorganizado' },
  ];

  private dynamicDialogConfig = inject(DynamicDialogConfig);
  private medicineService = inject(MedicineService);
  private userService = inject(UserService);
  private historyService = inject(HistoryService);
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);
  private fb = inject(FormBuilder);

  currentDate: Date = new Date();

  historyForm: FormGroup = this.fb.group({
    medicoId: [this.idMedic],
    pacienteId: [this.idPatient],
    weight_patient: [null, [Validators.required, Validators.min(1)]],
    tall_patient: [null, [Validators.required, Validators.min(1)]],
    pulse_patient: [null, [Validators.required, Validators.min(1)]],
    presure_patient: [null, [Validators.required, Validators.min(1)]],
    frequency_patient: [null, [Validators.required, Validators.min(1)]],
    temperature_patient: [null, [Validators.required, Validators.min(1)]],
    consult_reason: ['', [Validators.required]],
    fisic_exam: ['', [Validators.required]],
    recipe: [[], [Validators.required]],
    fenotype: ['', Validators.required],
    current_illness: ['', [Validators.required]],
    diagnostic: ['', [Validators.required]],
    medic_indications: ['', [Validators.required]],
  });

  ngOnInit(): void {
    this.idPatient = Number(this.dynamicDialogConfig.data.idPatient);
    this.idHistory = Number(this.dynamicDialogConfig.data.idHistory);
    this.idMedic = Number(localStorage.getItem('ID'));

    this.formatDate();
    this.getMedicData();
    this.getMedicines();
  }

  formatDate() {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth() + 1;
    const day = this.currentDate.getDate();
    this.currentDate = new Date(`${year}-${month}-${day}`);
  }

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

  getMedicines() {
    this.medicineService.getAllMedicines().subscribe({
      next: (resp: Medicine[]) => {
        this.medicines = resp;
        this.getHistoryData();
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  getHistoryData() {
    this.historyService.getHistoryById(this.idHistory).subscribe({
      next: (data) => {
        let recipeArray: string[] = [];

        //le asignamos a recipeArray el valor de data.recipe separado por comas
        recipeArray = data.recipe
          .filter((item: string) => item !== '')
          .join(',')
          .split(',');

        this.historyForm.patchValue({
          weight_patient: data.weight_patient,
          tall_patient: data.tall_patient,
          pulse_patient: data.pulse_patient,
          presure_patient: data.presure_patient,
          frequency_patient: data.frequency_patient,
          temperature_patient: data.temperature_patient,
          consult_reason: data.consult_reason,
          fisic_exam: data.fisic_exam,
          current_illness: data.current_illness,
          diagnostic: data.diagnostic,
          medic_indications: data.medic_indications,
          recipe: recipeArray,
          fenotype: data.fenotype
        });
        this.historyForm.patchValue({
          medicoId: this.idMedic,
          pacienteId: this.idPatient,
        });

        this.historyFormData = data;
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  updateHistory() {
    const idHistory = this.idHistory;
    const historyData = this.historyForm.value;

    this.confirmationService.confirm({
      message: '¿Esta seguro que desea actualizar la Historia?',
      header: 'Actualizar Historia',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: 'none',
      rejectIcon: 'none',
      acceptLabel: 'Si',
      rejectLabel: 'No',
      acceptButtonStyleClass: 'text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center disabled:bg-blue-400 pointer-events-auto',
      rejectButtonStyleClass: 'text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center  disabled:bg-red-400 pointer-events-auto mr-2', 
      accept: () => {
        this.historyService.updateHistory(idHistory, historyData).subscribe({
          next: (data) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: 'La Historia ha sido actualizada con exito',
            });

            this.historyComponent.ngOnInit();
            this.historyForm.markAsPristine();
            setTimeout( () => {
              this.closeModal();
            }, 1200)
          },
          error: (error) => {
            console.error(error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Ha ocurrido un error al actualizar la Historia',
            });
          },
        });
      },
      reject: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Cancelado',
          detail: 'La actualización de la Historia ha sido cancelada',
        });
      },
    });
  }

  cancelUpdate() {
    this.confirmationService.confirm({
      message:
        '¿Esta seguro que desea cancelar la actualización de la Historia?',
      header: 'Cancelar Actualización',
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
          detail: 'La actualización de la Historia ha sido cancelada',
        });
        this.historyForm.reset(this.historyFormData);
        this.historyForm.markAsPristine();
        setTimeout(() => {
          this.closeModal();
        }, 1200);
      },
      reject: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Información',
          detail: 'La actualización de la Historia no ha sido cancelada',
        });
      },
    });
  }

  closeModal() {
    this.ref.close(
      this.historyComponent.ngOnInit()
    );
  }

  ngOnDestroy() {
  }
}
