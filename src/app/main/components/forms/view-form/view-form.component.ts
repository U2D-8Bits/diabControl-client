import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { FormService } from '../../../services/form.service';
import { FormDataService } from '../../../services/form-data.service';
import { User } from '../../../../auth/interfaces';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Form } from '../../../interfaces/form.interface';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-view-form',
  templateUrl: './view-form.component.html',
  styleUrl: './view-form.component.css',
  providers: [ConfirmationService, MessageService]
})
export class ViewFormComponent implements OnInit {
  @ViewChild('inputForm') inputForm!: ElementRef;



  //? Variables e inyecciones
  private formService = inject(FormService);
  private formDataService = inject(FormDataService);
  private fb = inject(FormBuilder);
  private idForm!: number;
  public userData?: User;
  public formData?: Form;
  myForm!: FormGroup;





  ngOnInit(): void {
    console.log(`ViewFormComponent initialized`);





    //* Se obtiene el ID del formulario
    this.formDataService.currentFormId.subscribe({
      next: (data) => {
        this.idForm = data;
        console.log(`ID del formulario =>`, this.idForm);
      },
      error: (error) => {
        console.error(`Error al obtener el ID del formulario`, error);
      },
    });





    //* se crea el formulario
    this.myForm = this.fb.group({
      form_title: ['', [Validators.required]],
      form_diabetes_type: ['', [Validators.required]],
      form_glucose_mesure_date: ['', [Validators.required]],
      form_glucose_level: [0, [Validators.required]],
      form_glucose_mesure_frequency: ['', [Validators.required]],
      form_glucose_average_level: ['', [Validators.required]],
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
      id_form: [this.formData?.id_form, [Validators.required]],
    });





    //* Se obtiene el formulario por el ID
    this.formService.getFormById(this.idForm)
      .subscribe({
        next: (formGetter: Form) => {
          this.formData = formGetter;
          this.userData = formGetter.user;

          this.myForm.patchValue({
            form_title: this.formData.form_title,
            form_diabetes_type: this.formData.form_diabetes_type,
            form_glucose_mesure_date: this.formData.form_glucose_mesure_date,
            form_glucose_level: this.formData.form_glucose_level,
            form_glucose_mesure_frequency: this.formData.form_glucose_mesure_frequency,
            form_glucose_average_level: this.formData.form_glucose_average_level,
            form_eat_habits: this.formData.form_eat_habits,
            form_eat_habits_description: this.formData.form_eat_habits_description,
            form_physical_activity: this.formData.form_physical_activity,
            form_physical_activity_description: this.formData.form_physical_activity_description,
            form_physical_activity_frequency: this.formData.form_physical_activity_frequency,
            form_blurred_vision: this.formData.form_blurred_vision,
            form_slow_healing: this.formData.form_slow_healing,
            form_tingling_numbness: this.formData.form_tingling_numbness,
            form_extreme_faigue: this.formData.form_extreme_faigue,
            form_incresed_thirst: this.formData.form_incresed_thirst,
            form_diabetes_objective: this.formData.form_diabetes_objective,
            form_additional_questions: this.formData.form_additional_questions,
            id_form: this.formData.id_form,
            user: this.userData,
          });


          this.updatePhysicalActivityFrequency(this.formData.form_physical_activity);
          
        },
        error: (err: any) => {
          console.log(err);
        },
      });


      this.myForm.get('form_physical_activity')?.valueChanges
        .subscribe({
          next: (value: boolean) => {
            this.updatePhysicalActivityFrequency(value);
          }
        })


  }



  private updatePhysicalActivityFrequency(value: boolean){
    const frequencyControl = this.myForm.get('form_physical_activity_frequency');
    if(value === false){
      frequencyControl?.disable();
      frequencyControl?.setValue('');
    }else{
      frequencyControl?.enable();
    }
  }





  ngOnDestroy() {
    console.log(`ViewFormComponent destroyed`);
  }
}
