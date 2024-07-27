import { Component, inject, OnInit } from '@angular/core';
import { ValidatorFn, AbstractControl, ValidationErrors, FormBuilder } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { HistoriesPageComponent } from '../../../pages/histories-page/histories-page.component';
import { ControlService } from '../../../services/controls/control.service';
import { HistoryService } from '../../../services/history.service';

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
  styleUrl: './update-control.component.css',
  providers: [ConfirmationService, MessageService],
})
export class UpdateControlComponent implements OnInit {

  private ref: DynamicDialogRef = inject(DynamicDialogRef);
  private dynamicDialogConfig = inject(DynamicDialogConfig);
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);
  private controlService = inject(ControlService);
  private historyService = inject(HistoryService);
  private fb = inject(FormBuilder);

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }

}
