import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { ActPageComponent } from '../../../pages/act-page/act-page.component';
import { ActService } from '../../../services/act.service';
import { UserService } from '../../../services/user.service';
import { Subscription } from 'rxjs';
import { User } from '../../../../auth/interfaces/user.interface';
import { ActInterface } from '../../../interfaces/acts/act.interface';

@Component({
  selector: 'app-view-act',
  templateUrl: './view-act.component.html',
  styleUrl: './view-act.component.css',
  providers: [ConfirmationService, MessageService],
})
export class ViewActComponent implements OnInit, OnDestroy {
  private ref: DynamicDialogRef = inject(DynamicDialogRef);
  private dynamicDialogConfig = inject(DynamicDialogConfig);
  private actComponent = inject(ActPageComponent);
  private userService = inject(UserService);
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);
  private actService = inject(ActService);
  private fb = inject(FormBuilder);

  idPatient!: number;
  idAct!: number;
  patientData!: User;
  subscriptions: Subscription[] = [];
  currentDate: string = '';
  defaultActData!: ActInterface;

  actForm = this.fb.group({
    minor_age: [false, [Validators.required]],

    disability: [false, [Validators.required]],

    illiteracy: [false, [Validators.required]],

    tutor_names: [{ value: '', disabled: true }, [Validators.required]],

    tutor_ced: [
      { value: '', disabled: true },
      [Validators.required, Validators.minLength(10), Validators.maxLength(10)],
    ],

    tutor_phone: [
      { value: '', disabled: true },
      [Validators.required, Validators.minLength(10), Validators.maxLength(10)],
    ],

    tutor_email: [
      { value: '', disabled: true },
      [Validators.required, Validators.email],
    ],

    tutor_motive: [{ value: '', disabled: true }, [Validators.required]],

    id_patient: [Number(this.dynamicDialogConfig.data.idPatient)],
  });

  ngOnInit(): void {
    this.idPatient = this.dynamicDialogConfig.data.idPatient;
    this.idAct = this.dynamicDialogConfig.data.idAct;

    this.getPatientData();
    this.getActData();
    this.initializeFormListeners();
  }

  //? Metodo para obtener la informacion del paciente
  getPatientData() {
    this.userService.getUserById(this.idPatient).subscribe({
      next: (res) => {
        this.patientData = res;
        this.updateMinorAgeSwitch();
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  //? Metodo para obtener la informacion de un Acta
  getActData() {
    this.actService.getActById(this.idAct).subscribe({
      next: (res) => {
        this.actForm.patchValue(res);
        this.createdAt(res);
        this.defaultActData = res;
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  //? Metodo para destructurar el createdAt de un acta
  createdAt(dataAct: ActInterface) {
    const createdAt = new Date(dataAct.created_at);
    const day = createdAt.getDate();
    const month = createdAt.toLocaleString('default', { month: 'long' });
    const year = createdAt.getFullYear();
    this.currentDate = `En Santo Domingo, a ${day} de ${month}, de ${year}`;
  }

  //? Metodo para actualizar el estado del switch de minor_age basado en la edad del paciente
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

  //? Metodo para inicializar los listeners del formulario
  initializeFormListeners() {
    this.subscriptions.push(
      this.actForm
        .get('disability')!
        .valueChanges.subscribe(() => this.updateTutorFieldsState()),
      this.actForm
        .get('illiteracy')!
        .valueChanges.subscribe(() => this.updateTutorFieldsState())
    );
    this.updateTutorFieldsState(); // Initial call to set the correct state
  }

  //? Metodo para actualizar el estado de los campos del tutor
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

      // Reset the values
      this.actForm.get('tutor_names')!.reset();
      this.actForm.get('tutor_ced')!.reset();
      this.actForm.get('tutor_phone')!.reset();
      this.actForm.get('tutor_email')!.reset();
      this.actForm.get('tutor_motive')!.reset();
    }
  }

  //? Metodo para actualizar el acta
  updateAct() {
    const idAct = this.idAct;
    const actData = this.actForm.value;

    //si el paciente es menor de edad asignamos true a la propiedad minor_age
    if (this.patientData.user_age < 18) {
      actData.minor_age = true;
    } else {
      actData.minor_age = false;
    }

    //si los campos de tutor estan deshabilitados asignamos null a sus propiedades
    if (
      !this.actForm.get('tutor_names')!.enabled ||
      !this.actForm.get('tutor_ced')!.enabled ||
      !this.actForm.get('tutor_phone')!.enabled ||
      !this.actForm.get('tutor_email')!.enabled ||
      !this.actForm.get('tutor_motive')!.enabled
    ) {
      actData.tutor_names = '';
      actData.tutor_ced = '';
      actData.tutor_phone = null;
      actData.tutor_email = null;
      actData.tutor_motive = '';
    }

    console.log(`Valores a Actualizar:`, actData);

    this.confirmationService.confirm({
      message: '¿Está seguro que desea actualizar el Consentimiento Informado?',
      header: 'Actualizar Consentimiento Informado',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: 'none',
      rejectIcon: 'none',
      acceptLabel: 'Si',
      rejectLabel: 'No',
      acceptButtonStyleClass: 'text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center disabled:bg-blue-400 pointer-events-auto',
      rejectButtonStyleClass: 'text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center  disabled:bg-red-400 pointer-events-auto mr-2', 
      accept: () => {
        this.actService.updateAct(idAct, actData).subscribe({
          next: (data) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Consentimiento Informado Actualizado',
              detail:
                'El Consentimiento Informado ha sido actualizado con éxito',
            });
            this.actComponent.ngOnInit();
            this.actForm.markAsPristine();

            setTimeout(() => {
              this.closeModal();
            }, 1350);
          },
          error: (error) => {
            console.error(error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error al Actualizar el Consentimiento Informado',
              detail:
                error.error.message ||
                'Ha ocurrido un error al actualizar el Consentimiento Informado',
            });
          },
        });
      },
      reject: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Actualización Cancelada',
          detail:
            'La actualización del Consentimiento Informado ha sido cancelada',
        });
      },
    });
  }

  //? Metodo para cancelar la actualizacion del acta
  cancelAct() {
    this.confirmationService.confirm({
      message:
        '¿Está seguro que desea cancelar la actualización del Consentimiento Informado?',
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
          summary: 'Actualización Cancelada',
          detail:
            'La actualización del Consentimiento Informado ha sido cancelada',
        });
        this.actForm.patchValue(this.defaultActData);
        this.actComponent.ngOnInit();
        setTimeout(() => {
          this.closeModal();
        }, 1350);
      },
      reject: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Actualización no Cancelada',
          detail:
            'La actualización del Consentimiento Informado no ha sido cancelada',
        });
      },
    });
  }

  //? Metodo para cerrar el modal
  closeModal() {
    this.ref.close();
  }

  ngOnDestroy(): void {}
}
