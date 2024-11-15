import { Component, inject, OnInit } from '@angular/core';
import { ValidatorFn, AbstractControl, ValidationErrors, FormBuilder, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { ControlService } from '../../../services/controls/control.service';
import { HistoryService } from '../../../services/history.service';
import { Control } from '../../../interfaces/controls/control.interface';
import { UpdateControl } from '../../../interfaces/controls/control-update.interface';
import { ControlPageComponent } from '../../../pages/control-page/control-page.component';

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
  selector: 'app-update-control',
  templateUrl: './update-control.component.html',
  styleUrls: ['./update-control.component.css'],
  providers: [ConfirmationService, MessageService],
})
export class UpdateControlComponent implements OnInit {

  private ref: DynamicDialogRef = inject(DynamicDialogRef);
  private dynamicDialogConfig = inject(DynamicDialogConfig);
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);
  private controlService = inject(ControlService);
  private controlPage = inject(ControlPageComponent)
  private fb = inject(FormBuilder);

  public idControl: number = 0;

  controlForm = this.fb.group({
    observation: ['', [Validators.required]],
    date_control: ['', [Validators.required, dateValidator()]],  // Agrega el validador aquí
    recommendations: ['', [Validators.required]],
  });

  defaultControlForm = this.fb.group({
    observation: ['', [Validators.required]],
    date_control: ['', [Validators.required, dateValidator()]],  // Agrega el validador aquí
    recommendations: ['', [Validators.required]],
  });

  ngOnInit(): void {
    this.idControl = this.dynamicDialogConfig.data.idControl;
    this.getDataControl();
  }

  getDataControl() {
    this.controlService.getControlById(this.idControl)
      .subscribe({
        next: (controlData: Control) => {
          this.controlForm.patchValue(controlData);
          this.defaultControlForm.patchValue(controlData);
        },
        error: (error) => {
          console.error(error);
        },
      });
  }

  updateControl(): void {


    const controlUpdateData: UpdateControl = this.controlForm.value as UpdateControl;

    this.confirmationService.confirm({
      message: '¿Está seguro que desea actualizar esta valoración de la Historia clínica?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: 'none',
      rejectIcon: 'none',
      acceptLabel: 'Si',
      rejectLabel: 'No',
      acceptButtonStyleClass: 'text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center disabled:bg-blue-400 pointer-events-auto',
      rejectButtonStyleClass: 'text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center  disabled:bg-red-400 pointer-events-auto mr-2', 
      accept: () => {
        this.controlService.updateControl(this.idControl, controlUpdateData)
        .subscribe({
          next: (response) => {
            this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Control actualizado correctamente' });
            
            setTimeout( () => {
              this.closeDialog();
              this.controlPage.ngOnInit();
            }, 1500)
          }
        })
      },
      reject: () => {
        this.messageService.add({ severity: 'info', summary: 'Información', detail: 'Operación cancelada' });
        this.controlForm.patchValue(this.defaultControlForm.value);
      }
    })
  }

  cancelUpdate(): void {
    this.confirmationService.confirm({
      message: '¿Está seguro que desea cancelar la actualización de la valoración?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: 'none',
      rejectIcon: 'none',
      acceptLabel: 'Si',
      rejectLabel: 'No',
      acceptButtonStyleClass: 'text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center disabled:bg-blue-400 pointer-events-auto',
      rejectButtonStyleClass: 'text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center  disabled:bg-red-400 pointer-events-auto mr-2', 
      accept: () => {
        this.messageService.add({ severity: 'info', summary: 'Información', detail: 'Operación cancelada' });
        setTimeout( () => {
          this.closeDialog();
          this.controlForm.patchValue(this.defaultControlForm.value);
          this.controlPage.ngOnInit();
        }, 1500)
      },
      reject: () => {
        this.messageService.add({ severity: 'info', summary: 'Información', detail: 'Operación cancelada' });
      }
    })
  }

  closeDialog(): void {
    this.ref.close();
  }

  ngOnDestroy(): void {
  }
}
