import { Component, inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { User } from '../../../../auth/interfaces/user.interface';
import { UserService } from '../../../services/user.service';
import { HistoryService } from '../../../services/history.service';
import { HistoriesPageComponent } from '../../../pages/histories-page/histories-page.component';
import { ConfirmationService, MessageService } from 'primeng/api';
import { MedicineService } from '../../../services/meds/medicines.service';
import { Medicine } from '../../../interfaces/Medicines/medicines.interface';

@Component({
  selector: 'app-create-history',
  templateUrl: './create-history.component.html',
  styleUrls: ['./create-history.component.css'],
  providers: [ConfirmationService, MessageService],
})
export class CreateHistoryComponent implements OnInit {
  private historyComponent = inject(HistoriesPageComponent);
  private idPatient!: number;
  private idMedic!: number;
  dataMedic!: User;
  medicNames: string = '';

  private dynamicDialogConfig = inject(DynamicDialogConfig);
  private ref: DynamicDialogRef = inject(DynamicDialogRef);
  private userService = inject(UserService);
  private historyService = inject(HistoryService);
  private medicineService = inject(MedicineService);
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);
  private fb = inject(FormBuilder);

  medicines: Medicine[] = [];
  currentDate: Date = new Date();

  fenotypes: any[] = [
    { name_fenotype: "Picoteador / Emocional" },
    { name_fenotype: "Compulsivo" },
    { name_fenotype: "Hiperfágico" },
    { name_fenotype: "Hedónico" },
    { name_fenotype: "Desorganizado" }
  ];

  historyForm: FormGroup = this.fb.group({
    medicoId: [this.idMedic],
    pacienteId: [this.idPatient],
    weight_patient: [null, [Validators.required, Validators.min(1)]],
    tall_patient: [null, [Validators.required, Validators.min(1)]],
    pulse_patient: [null, [Validators.required, Validators.min(1)]],
    presure_patient: [null, [Validators.required, Validators.min(1)]],
    frequency_patient: [null, [Validators.required, Validators.min(1)]],
    temperature_patient: [null, [Validators.required, Validators.min(1)]],
    consult_reason: ['', Validators.required],
    fisic_exam: ['', Validators.required],
    recipe: [[], Validators.required],
    fenotype: ['', Validators.required],
    current_illness: ['', Validators.required],
    diagnostic: ['', Validators.required],
    medic_indications: ['', Validators.required],
  });

  ngOnInit() {
    this.idPatient = this.dynamicDialogConfig.data.idPatient;
    this.idMedic = Number(localStorage.getItem('ID'));
    this.formatDate();
    this.getMedicines();
    this.getMedicData();
    console.log(this.fenotypes);
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
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  createHistory() {
    this.historyForm.patchValue({
      medicoId: this.idMedic,
      pacienteId: Number(this.idPatient)
    });
    const historyData = this.historyForm.value;
    console.log(historyData);

    this.confirmationService.confirm({
      message: '¿Está seguro que desea crear esta Historia Clínica?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: 'none',
      rejectIcon: 'none',
      rejectButtonStyleClass: 'p-button-danger',
      acceptButtonStyleClass: 'p-button-success',
      accept: () => {
        this.historyService.crateHistory(historyData).subscribe({
          next: (data) => {
            console.log("Valor de Data =>", data);
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Historia Clínica creada correctamente',
            });
            this.historyComponent.ngOnInit();
            this.resetForm();
            setTimeout(() => {
              this.closeModal();
            }, 1200);
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
          detail: 'Creación de Historia Clinica cancelada',
        });
      },
    });
  }

  resetForm() {
    this.historyForm.reset({
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
      recipe: [],
      fenotype: '',
      current_illness: '',
      diagnostic: '',
      medic_indications: ''
    });
  }

  cancelHistory() {
    this.confirmationService.confirm({
      message: '¿Está seguro que desea cancelar la creación de la Historia Clinica?',
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
        this.resetForm();
        setTimeout(() => {
          this.closeModal();
        }, 1200);
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


  closeModal() {
    this.ref.close(
      this.historyComponent.ngOnInit()
    );
  }

  ngOnDestroy() {
    console.log(`Componente CreateHistory destruido`);
  }
}
