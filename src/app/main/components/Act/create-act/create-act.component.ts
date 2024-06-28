import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ActPageComponent } from '../../../pages/act-page/act-page.component';
import { UserService } from '../../../services/user.service';
import { ActService } from '../../../services/act.service';
import { FormBuilder, Validators } from '@angular/forms';
import { User } from '../../../../auth/interfaces';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-create-act',
  templateUrl: './create-act.component.html',
  styleUrl: './create-act.component.css',
  providers: [ConfirmationService, MessageService],
})
export class CreateActComponent implements OnInit, OnDestroy {
  private ref: DynamicDialogRef = inject(DynamicDialogRef);
  private dynamicDialogConfig = inject(DynamicDialogConfig);
  private actComponent = inject(ActPageComponent);
  private userService = inject(UserService);
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);
  private actService = inject(ActService);
  private fb = inject(FormBuilder);

  idPatient!: number;
  patientData!: User;
  subscriptions: Subscription[] = [];
  currentDate: string;

  actForm = this.fb.group({
    minor_age: [false, [Validators.required]],
    disability: [false, [Validators.required]],
    illiteracy: [false, [Validators.required]],
    tutor_names: [{ value: '', disabled: true }, [Validators.required]],
    tutor_ced: [{ value: '', disabled: true }, [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
    tutor_phone: [{ value: '', disabled: true }, [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
    tutor_email: [{ value: '', disabled: true }, [Validators.required, Validators.email]],
    tutor_motive: [{ value: '', disabled: true }, [Validators.required]],
    id_patient: [Number(this.dynamicDialogConfig.data.idPatient)],
  });

  constructor() {
    const now = new Date();
    const day = now.getDate();
    const month = now.toLocaleString('default', { month: 'long' });
    const year = now.getFullYear();
    this.currentDate = `En Santo Domingo, a ${day} de ${month}, de ${year}`;
  }

  ngOnInit(): void {
    this.idPatient = Number(this.dynamicDialogConfig.data.idPatient);
    this.getPatientData();
    this.initializeFormListeners();
  }

  getPatientData() {
    this.userService.getUserById(this.idPatient).subscribe({
      next: (patientReceived: User) => {
        this.patientData = patientReceived;
        this.updateMinorAgeSwitch();
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  updateMinorAgeSwitch() {
    if (this.patientData.user_age < 18) {
      this.actForm.get('minor_age')!.setValue(true);
      this.actForm.get('minor_age')!.enable();
    } else {
      this.actForm.get('minor_age')!.setValue(false);
      this.actForm.get('minor_age')!.disable();
    }
    this.updateTutorFieldsState();
  }

  initializeFormListeners() {
    this.subscriptions.push(
      this.actForm.get('disability')!.valueChanges.subscribe(() => this.updateTutorFieldsState()),
      this.actForm.get('illiteracy')!.valueChanges.subscribe(() => this.updateTutorFieldsState())
    );
    this.updateTutorFieldsState(); // Initial call to set the correct state
  }

  updateTutorFieldsState() {
    const minorAge = this.actForm.get('minor_age')!.value;
    const disability = this.actForm.get('disability')!.value;
    const illiteracy = this.actForm.get('illiteracy')!.value;

    if (minorAge || disability || illiteracy) {
      this.actForm.get('tutor_names')!.enable();
      this.actForm.get('tutor_ced')!.enable();
      this.actForm.get('tutor_phone')!.enable();
      this.actForm.get('tutor_email')!.enable();
      this.actForm.get('tutor_motive')!.enable();
    } else {
      this.actForm.get('tutor_names')!.disable();
      this.actForm.get('tutor_ced')!.disable();
      this.actForm.get('tutor_phone')!.disable();
      this.actForm.get('tutor_email')!.disable();
      this.actForm.get('tutor_motive')!.disable();

      this.actForm.get('tutor_names')!.reset();
      this.actForm.get('tutor_ced')!.reset();
      this.actForm.get('tutor_phone')!.reset();
      this.actForm.get('tutor_email')!.reset();
      this.actForm.get('tutor_motive')!.reset();
    }
  }

  createAct() {
    this.actForm.patchValue({
      id_patient: this.idPatient,
    });

    const actData = this.actForm.value;

    if (this.patientData.user_age < 18) {
      actData.minor_age = true;
    } else {
      actData.minor_age = false;
    }

    if (actData.minor_age || actData.disability || actData.illiteracy) {
      if (
        !actData.tutor_names ||
        !actData.tutor_ced ||
        !actData.tutor_phone ||
        !actData.tutor_email ||
        !actData.tutor_motive
      ) {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Debe completar los datos del tutor',
        });
        return;
      }
    }

    console.log(`Valores de ActData =>`, actData);

    this.confirmationService.confirm({
      message: 'Está seguro que desea crear este Consentimiento Informado?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: 'none',
      rejectIcon: 'none',
      rejectButtonStyleClass: 'p-button-danger, padding: 10px; border-radius: 5px; border: 1px solid red;',
      acceptButtonStyleClass: 'p-button-success',
      accept: () => {
        this.actService.createAct(actData).subscribe({
          next: (data) => {
            console.log(data);
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Consentimiento Informado creado correctamente',
            });
            this.actComponent.ngOnInit();
            setTimeout(() => {
              this.ref.close();
            }, 1750);
          },
          error: (error) => {
            console.error(error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Error al crear el Consentimiento Informado',
            });
          },
        });
      },
      reject: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Info',
          detail: 'Operación cancelada',
        });
      },
    });
  }

  cancelAct() {
    this.confirmationService.confirm({
      message: 'Está seguro que desea cancelar la creación de este Consentimiento Informado?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: 'none',
      rejectIcon: 'none',
      rejectButtonStyleClass: 'p-button-danger, padding: 10px; border-radius: 5px; border: 1px solid red;',
      acceptButtonStyleClass: 'p-button-success',
      accept: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Info',
          detail: 'Operación cancelada',
        });
        setTimeout(() => {
          this.ref.close();
        }, 1250);
      },
      reject: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Operación no cancelada',
        });
      },
    });
  }

  closeDialog() {
    this.ref.close();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
