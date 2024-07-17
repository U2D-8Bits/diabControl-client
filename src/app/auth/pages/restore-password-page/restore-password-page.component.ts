import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, Validators } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import Swal from 'sweetalert2';

@Component({
  selector: 'auth-restore-password-page',
  templateUrl: './restore-password-page.component.html',
  styleUrl: './restore-password-page.component.css',
  providers: [ConfirmationService, MessageService]
})
export class RestorePasswordPageComponent implements OnInit {


  private authService = inject(AuthService);
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);
  private fb = inject(FormBuilder);

  resetForm = this.fb.group({
    user_email: [null, [Validators.required, Validators.email]]
  });


  ngOnInit(): void {
    

  }


  //* Metodo para enviar correo de restablecimiento de contraseña
  sendResetEmail(): void {
    const email = this.resetForm.get('user_email')?.value;
  
    //? Validar que el correo no este vacio
    if (email === null) {
      this.messageService.add({severity: 'error', summary: 'Error', detail: 'El correo no puede estar vacio'});
      return;
    }
  
    //? Validar que el correo no sea undefined
    if (email === undefined) {
      this.messageService.add({severity: 'error', summary: 'Error', detail: 'El correo no puede estar vacio'});
      return;
    }
  
    //? Enviar el correo de restablecimiento de contraseña
    Swal.fire({
      title: 'Enviando correo',
      html: 'Por favor espere un momento',
      allowOutsideClick: false,
      timerProgressBar: true,
      showConfirmButton: false,
      timer: 3000,
      didOpen: () => {
        Swal.showLoading();
      }
    }).then(() => {
      Swal.close();
    });

    this.authService.resetPassword(email)
      .subscribe({
        next: (resp) => {
          this.messageService.add({severity: 'success', summary: 'Correo enviado', detail: 'Se ha enviado un correo con una contraseña temporal, revisa tu bandeja de entrada'});
        },
        error: (err) => {
          console.log(err);
          this.messageService.add({severity: 'error', summary: 'Error', detail: err});
        }
      })

  }


  ngOnDestroy(): void {

  }

}
