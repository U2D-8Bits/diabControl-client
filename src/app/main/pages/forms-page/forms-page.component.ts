import { Component, inject, OnInit } from '@angular/core';

import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CreateFormComponent } from '../../components/forms/create-form/create-form.component';

@Component({
  selector: 'app-forms-page',
  templateUrl: './forms-page.component.html',
  styleUrl: './forms-page.component.css',
  providers: [DialogService]
})
export class FormsPageComponent implements OnInit {

  constructor() {}

  //? Varriables e Inyecciones
  ref: DynamicDialogRef | undefined;
  public forms: any[] = [];
  public dialogService = inject(DialogService);

  ngOnInit() {
    console.log(`FormsPageComponent initialized!`)
  }

  showDialog( action: string, title: string ){
        //* Mostrar el compomente de agregar paciente
        if( action === 'create'){
          this.ref = this.dialogService.open(CreateFormComponent, {
            header: title,
            maximizable: true,
            // Hacemos que el dialogo ocupe el 60% del ancho en computadores y el 100% en dispositivos móviles
            breakpoints: { '960px': '500px', '640px': '100vw' },
            style: { 'max-width': '100vw', 'width': '80vw'},
            height: '80%',
            contentStyle: {"overflow": "auto"},
          })
        }
    
        // if( action === 'view'){
        //   this.ref = this.dialogService.open(ViewPatientComponent, {
        //     header: title,
        //     width: '40%',
        //     contentStyle: {"max-height": "500px", "overflow": "auto"},
        //   })
        // }
    
        //* Mostrar el componente para ver/editar un paciente
        if (this.ref) {
          this.ref.onClose.subscribe(() => {
            this.ngOnInit();
          });
        }
  }


  ngOnDestroy(){
    console.log(`FormsPageComponent destroyed!`)
  }

}
