import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { User } from '../../../../auth/interfaces/user.interface';
import { UserService } from '../../../services/user.service';
import { HistoryService } from '../../../services/history.service';

@Component({
  selector: 'app-create-history',
  templateUrl: './create-history.component.html',
  styleUrl: './create-history.component.css'
})
export class CreateHistoryComponent implements OnInit {


  //? Variables e Inyecciones
  ref: DynamicDialogRef | undefined;
  private idPatient!: number;
  private idMedic!: number;
  private dataMedic!: User;

  private dynamicDialogConfing = inject( DynamicDialogConfig)
  private userService = inject( UserService );
  private historyService = inject( HistoryService );
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


  ngOnDestroy(){
    console.log(`Componente CreateHistory destruido`);
  }

}
