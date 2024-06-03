import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { FormService } from '../../../services/form.service';
import { FormBuilder, Validators } from '@angular/forms';
import { User } from '../../../../auth/interfaces';

@Component({
  selector: 'app-create-form',
  templateUrl: './create-form.component.html',
  styleUrl: './create-form.component.css'
})
export class CreateFormComponent implements OnInit {

  constructor() { }

  //? Variables e Inyecciones
  private userService = inject( UserService )
  private formService = inject( FormService)
  private fb = inject( FormBuilder )
  private idUser: number = 0;
  userData?: User;

  //? Formularios
  myForm = this.fb.group({
    form_title: ['', [Validators.required]],
    form_diabetes_type: ['', [Validators.required]],
    form_glucose_mesure_date: ['', [Validators.required]],
    form_glucose_level: [0, [Validators.required]],
    form_glucose_mesure_frequency: ['', [Validators.required]],
    form_glucose_average_level: [0, [Validators.required]],
    form_eat_habits: [false, [Validators.required]],
    form_eat_habits_description: ['', [Validators.required]],
    form_physical_activity: [false, [Validators.required]],
    form_physical_activity_description: ['', [Validators.required]],
    form_physical_activity_frequency: ['', [Validators.required]],
    form_blurred_vision: [false, [Validators.required]],
    form_slow_healing: [false, [Validators.required]],
    form_tingling_numbness: [false, [Validators.required]],
    form_extreme_faigue: [false, [Validators.required]],
    form_incresed_thirst: [false, [Validators.required]],
    form_diabetes_objective: ['', [Validators.required]],
    form_additional_questions: ['', [Validators.required]],
    id_user: [this.idUser, [Validators.required]]
  })


  //* Lifecycle Hooks [ngOnInit()]
  ngOnInit() {
  
    console.log(`CreateFormComponent initialized`)





    //* Guardamos el valor del Id del usuario
    this.idUser = Number(localStorage.getItem('ID'))
    console.log(`ID User: ${this.idUser}`)





    //* Obtenemos toda la informacion del usuario a traves de userService
    this.userService.getUserById(this.idUser)
      .subscribe({
        next: (data) => {
          this.userData = data;
          console.log(`Informacion del usuario:`, this.userData)
        },
        error: (error) => {
          console.error(`Error al obtener la informacion del usuario`, error)
        }
      })

  }



  //* Lifecycle Hooks [ngOnDestroy()]
  ngOnDestroy(){

    console.log(`CreateFormComponent destroyed`)

  }


}
