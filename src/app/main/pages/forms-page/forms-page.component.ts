import { Component, inject, OnInit } from '@angular/core';

import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CreateFormComponent } from '../../components/forms/create-form/create-form.component';
import { FormService } from '../../services/form.service';
import { UserService } from '../../services/user.service';
import { Form } from '../../interfaces/form.interface';
import { ViewFormComponent } from '../../components/forms/view-form/view-form.component';
import { ConfirmationService, MessageService } from 'primeng/api';
import Swal from 'sweetalert2';
import { FormDataService } from '../../services/form-data.service';

@Component({
  selector: 'app-forms-page',
  templateUrl: './forms-page.component.html',
  styleUrl: './forms-page.component.css',
  providers: [DialogService, ConfirmationService, MessageService],
})
export class FormsPageComponent implements OnInit {
  constructor() {}

  //? Varriables e Inyecciones
  ref: DynamicDialogRef | undefined;
  public forms: Form[] = [];
  public dialogService = inject(DialogService);
  private userService = inject(UserService);
  private formDataService = inject( FormDataService )
  private formService = inject(FormService);
  private userID: number = Number(localStorage.getItem('ID'));





  //? NgOnInit
  ngOnInit() {
    console.log(`FormsPageComponent initialized!`);

    this.getForms();
  }





  //? Metodo para obtener todos mis formularios
  getForms() {
    this.formService.getFormsByUser(this.userID).subscribe({
      next: (formsGetters: Form[]) => {
        this.forms = formsGetters;
        console.log(`Formularios Obtenidos =>`, this.forms);
      },
      error: (err: any) => {
        console.log(err);
      },
    });
  }


  //? Funcion para enviar el id del formulario por un Observable
  sendFormId(id_form: number){
    this.formDataService.changeFormId(id_form)
  }





  //? Metodo para mostrar el dialogo de agregar paciente, ver paciente o editar paciente
  showDialog(action: string, title: string) {
    //* Mostrar el compomente de agregar paciente
    if (action === 'create') {
      this.ref = this.dialogService.open(CreateFormComponent, {
        header: title,
        maximizable: true,
        breakpoints: { '960px': '500px', '640px': '100vw' },
        style: { 'max-width': '100vw', width: '80vw' },
        height: '80%',
        contentStyle: { overflow: 'auto' },
      });
    }

    if (action === 'view') {
      this.ref = this.dialogService.open(ViewFormComponent, {
        header: title,
        maximizable: true,
        breakpoints: { '960px': '500px', '640px': '100vw' },
        style: { 'max-width': '100vw', width: '80vw' },
        height: '80%',
        contentStyle: { overflow: 'auto' },
      });
    }

    //* Mostrar el componente para ver/editar un paciente
    if (this.ref) {
      this.ref.onClose.subscribe(() => {
        this.ngOnInit();
      });
    }
  }





  //? Funcion para eliminar un formulario por su id
  deleteForm(idForm: number) {
    Swal.fire({
      title: '¿Estás seguro que desea eliminar este formulario?',
      text: '¡No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.formService.deleteForm(idForm).subscribe({
          next: (res: any) => {
            console.log(res);
            this.getForms();
          },
          error: (err: any) => {
            console.log(err);
          },
        });

        Swal.fire('¡Eliminado!', 'Tu formulario ha sido eliminado.', 'success');
      }
    });
  }





  //? NgOnDestroy
  ngOnDestroy() {
    console.log(`FormsPageComponent destroyed!`);
  }
}
