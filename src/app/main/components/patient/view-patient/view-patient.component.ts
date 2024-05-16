import { Component, inject, OnInit } from '@angular/core';
import { UserDataService } from '../../../services/user-data.service';
import { User } from '../../../../auth/interfaces';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-view-patient',
  templateUrl: './view-patient.component.html',
  styleUrl: './view-patient.component.css',
})
export class ViewPatientComponent implements OnInit {



  //? Injeciones y Variables
  private userDataService = inject(UserDataService);
  private userService = inject(UserService);
  private fb = inject(FormBuilder);
  public userId: number = 0;
  myForm!: FormGroup;
  patientData?: User;
  editInfo: boolean = false;
  editButtonDisabled: boolean = false;

  constructor() {}




  get CurrentPatient(): User {
    const currentPatient = this.myForm.value as User;
    return currentPatient;
  }





  ngOnInit(): void {
    console.log(`Componente ${this.constructor.name} iniciado`);





    //? Obtener el ID del paciente a traves del observable
    this.userDataService.currentUserId.subscribe((userID) => {
      this.userId = userID;
    });





    //? Formulario para editar el paciente
    this.myForm = this.fb.group({
      id_user: [this.userId],
      user_name: [{ value: '', disabled: true }, Validators.required],
      user_lastname: [{ value: '', disabled: true }, Validators.required],
      user_username: [{ value: '', disabled: true }, Validators.required],
      user_password: [
        { value: '', disabled: true },
        Validators.required,
        Validators.minLength(6),
      ],
      user_email: [
        { value: '', disabled: true },
        Validators.required,
        Validators.email,
      ],
      user_phone: [{ value: '', disabled: true }, Validators.required],
      user_ced: [{ value: 0, disabled: true }, Validators.required],
      user_status: [{ value: true, disabled: true }],
      role_id: [{ value: 0, disabled: true }],
    });




    
    //? Funcion para obtener los datos del paciente
    this.userService.getUserById(this.userId).subscribe((patientData) => {
      this.patientData = patientData;
      if (patientData) {
        this.myForm.patchValue(patientData);
      }
    });
  }




  onDestroy() {
    console.log(`Componente ${this.constructor.name} destruido`);
    this.userDataService.changeUserId(0);
  }
}
