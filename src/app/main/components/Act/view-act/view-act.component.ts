import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { ActPageComponent } from '../../../pages/act-page/act-page.component';
import { ActService } from '../../../services/act.service';
import { UserService } from '../../../services/user.service';
import { Subscription } from 'rxjs';
import { User } from '../../../../auth/interfaces/user.interface';

@Component({
  selector: 'app-view-act',
  templateUrl: './view-act.component.html',
  styleUrl: './view-act.component.css',
  providers: [ConfirmationService, MessageService],
})
export class ViewActComponent implements OnInit, OnDestroy {

  private ref: DynamicDialogRef = inject(DynamicDialogRef);
  private dynamicDialogConfig = inject(DynamicDialogConfig);
  private actComponent = inject( ActPageComponent);
  private userService = inject( UserService );
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);
  private actService = inject( ActService)
  private fb = inject( FormBuilder )

  idPatient!: number;
  idAct!: number;
  patientData!: User;
  subscriptions: Subscription[] = [];


  actForm = this.fb.group({
    minor_age: [false, [Validators.required]],

    disability: [false, [Validators.required]],

    illiteracy: [false, [Validators.required]],

    tutor_names: [{ value: '', disabled: true }, [Validators.required]],

    tutor_ced: [{ value: '', disabled: true }, [Validators.minLength(10), Validators.maxLength(10)]],

    tutor_phone: [{ value: '', disabled: true }, [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],

    tutor_email: [{ value: '', disabled: true }, [Validators.required, Validators.email]],

    tutor_motive: [{ value: '', disabled: true }, [Validators.required]],

    id_patient: [Number(this.dynamicDialogConfig.data.idPatient)],
  })

  

  ngOnInit(): void {
    
    this.idPatient = this.dynamicDialogConfig.data.idPatient;
    this.idAct = this.dynamicDialogConfig.data.idAct;

    this.getPatientData();
    this.getActData();

  }


  //? Metodo para obtener la informacion del paciente
  getPatientData(){
    this.userService.getUserById(this.idPatient)
    .subscribe({
      next: (res) => {
        this.patientData = res;
        console.log(`Datos del paciente:`, this.patientData)
      },
      error: (err) => {
        console.error(err);
      }
    })
  }


  //? Metodo para obtener la informacion de un Acta
  getActData(){
    this.actService.getActById(this.idAct)
    .subscribe({
      next: (res) => {
        this.actForm.patchValue(res);
        console.log(`Valores del actForm:`, this.actForm.value);
      },
      error: (err) => {
        console.error(err);
      }
    })
  }


  ngOnDestroy(): void {
    
  }

}
