import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';

@Component({
  selector: 'auth-login-page',
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css',
  providers: [MessageService]
})
export class LoginPageComponent {

  //* Inyecciones
  private fb = inject( FormBuilder);
  private authService = inject( AuthService);
  private messageService = inject( MessageService);
  private router = inject( Router);



  //* Formulario de Login
  public myForm: FormGroup = this.fb.group({
    user_username: ['', [Validators.required]],
    user_password: ['', [Validators.required, Validators.minLength(6)]]
  })





  //* Funcion para loguearse
  login(){

    const { user_username, user_password } = this.myForm.value;

    this.authService.login(user_username, user_password)
      .subscribe({
        next: () => {
          this.messageService.add({severity:'success', summary:'Exito', detail:'Bienvenido'});
          this.router.navigate(['/main']);
        },
        error: (error) => {
          console.log("Valor de err =>", error);
          this.messageService.add({severity:'error', summary:'Error', detail:error });
        }
      })
  }

}
