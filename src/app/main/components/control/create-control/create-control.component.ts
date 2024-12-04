import { Component, inject, OnInit } from '@angular/core';
import { ControlService } from '../../../services/controls/control.service';
import { FormBuilder, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { HistoryService } from '../../../services/history.service';
import { History } from '../../../interfaces/history.interface';
import { CreateControl } from '../../../interfaces/controls/control-create.interface';
import { HistoriesPageComponent } from '../../../pages/histories-page/histories-page.component';

// Función de validador de fecha
export function dateValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value) {
      return null;
    }

    const date = new Date(value);
    const currentDate = new Date();

    // Check if date is valid
    if (isNaN(date.getTime())) {
      return { invalidDate: true };
    }

    // Validate day, month, and year
    const [year, month, day] = value.split('-').map(Number);

    // Check if date parts are valid
    if (!isValidDate(year, month, day)) {
      return { invalidDate: true };
    }

    // Check if date is in the past or today
    if (date <= currentDate) {
      return { dateInPast: true };
    }

    return null;
  };
}

// Helper function to validate the day in the specific month and year
function isValidDate(year: number, month: number, day: number): boolean {
  const maxDaysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  // Check for leap year
  if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) {
    maxDaysInMonth[1] = 29;
  }

  return month > 0 && month <= 12 && day > 0 && day <= maxDaysInMonth[month - 1];
}

@Component({
  selector: 'app-create-control',
  templateUrl: './create-control.component.html',
  styleUrls: ['./create-control.component.css'],
  providers: [ConfirmationService, MessageService],
})
export class CreateControlComponent implements OnInit {
  private ref: DynamicDialogRef = inject(DynamicDialogRef);
  private dynamicDialogConfig = inject(DynamicDialogConfig);
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);
  private controlService = inject(ControlService);
  private historyService = inject(HistoryService);
  private historyPage = inject(HistoriesPageComponent);
  private fb = inject(FormBuilder);

  public idHistory: number = 0;
  public idPatient: number = 0;
  public idMedic: number = 0;
  public historyData: History | undefined;

  controlForm = this.fb.group({
    patientId: [this.idMedic, [Validators.required]],
    medicId: [this.idPatient, [Validators.required]],
    historyId: [this.idHistory, [Validators.required]],
    observation: ['', [Validators.required]],
    date_control: ['', [Validators.required, dateValidator()]],  // Agrega el validador aquí
    recommendations: ['', [Validators.required]],
  });

  ngOnInit(): void {
    this.idHistory = Number(this.dynamicDialogConfig.data.idHistory);
    this.getHistoryData();
  }

  getHistoryData(): void {
    this.historyService.getHistoryById(this.idHistory).subscribe({
      next: (value: History) => {
        this.historyData = value;
        this.idPatient = value.paciente.id_user;
        this.idMedic = value.medico.id_user;
      },
      error: (error: any) => {
        console.error(error);
      },
    });
  }

  createControl(): void {
    if (this.controlForm.invalid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Por favor, corrija los errores en el formulario antes de enviar.',
      });
      return;
    }

    this.controlForm.patchValue({
      patientId: this.idPatient,
      medicId: this.idMedic,
      historyId: this.idHistory,
    })

    const controlData: CreateControl = this.controlForm.value as CreateControl;

    this.confirmationService.confirm({
      message: '¿Está seguro que desea crear esta valoración de la Historia clínica?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: 'none',
      rejectIcon: 'none',
      acceptLabel: 'Si',
      rejectLabel: 'No',
      acceptButtonStyleClass: 'text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center disabled:bg-blue-400 pointer-events-auto',
      rejectButtonStyleClass: 'text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center  disabled:bg-red-400 pointer-events-auto mr-2',
      accept: () => {
        this.controlService.createControl(controlData).subscribe({
          next: (data) => {
            this.messageService.add({
              severity: 'success',
              summary:'Éxito',
              detail: 'Valoración de la Historia Clínica creada correctamente',
            });

            setTimeout(() => {
              this.closeDialog();
              this.historyPage.ngOnInit();
            }, 1500);
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
          detail: 'Creación de la valoración cancelada',
        });
      },
    });
  }

  cancelCreation(): void {
    this.confirmationService.confirm({
      message: '¿Está seguro que desea cancelar la creación de la valoración?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: 'none',
      rejectIcon: 'none',
      rejectButtonStyleClass: 'p-button-danger',
      acceptButtonStyleClass: 'p-button-success',
      accept: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Info',
          detail: 'Creación de la valoración cancelada',
        });
        setTimeout(() => {
          this.closeDialog();
          this.historyPage.ngOnInit();
        }, 1500);
      },
      reject: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Info',
          detail: 'Creación de la valoración cancelada',
        });
      }
    });
  }

  closeDialog(): void {
    this.ref.close();
  }

  ngOnDestroy(): void {}
}
