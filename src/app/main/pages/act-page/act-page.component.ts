import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { ActivatedRoute } from '@angular/router';
import { User } from '../../../auth/interfaces';
import { ActService } from '../../services/act.service';
import { ActInterface } from '../../interfaces/acts/act.interface';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import Swal from 'sweetalert2';
import { CreateActComponent } from '../../components/Act/create-act/create-act.component';
import { ViewActComponent } from '../../components/Act/view-act/view-act.component';

@Component({
  selector: 'app-act-page',
  templateUrl: './act-page.component.html',
  styleUrl: './act-page.component.css',
  providers: [ConfirmationService, MessageService, DialogService]
})
export class ActPageComponent implements OnInit {

  //? Variables e Inyecciones
  private userService = inject(UserService);
  private actService = inject(ActService);
  private route = inject( ActivatedRoute )
  private dialogService = inject( DialogService );

  private idPatient!: number;
  public patientData!: User;
  existAct: boolean = false;
  public actData!: ActInterface;

  
  ngOnInit() {
    console.log(`Componente ActPage creado`)

    this.idPatient = Number(this.route.snapshot.params['id']);

    this.getPatientData();
    this.getActaByPatientId();
  }


  //? Metodo para obtener los datos del paciente
  getPatientData(){
    this.userService.getUserById( this.idPatient)
    .subscribe({
      next: (user: User) => {
        this.patientData = user;
        console.log(`data recivida:`, this.patientData)
      },
      error: (err: any) => {
        console.error(err);
      }
    })
  }


  //? Metodo para obtener el acta del paciente
  getActaByPatientId(){
    this.actService.getActByPatientId(this.idPatient)
    .subscribe({
      next: (act: ActInterface) => {
        this.actData = act;
        this.existAct = true;
      },
      error: (err: any) => {
        console.error(err);
        this.existAct = false;
      }
    })
  }


  //? Metodo para abir el dialogo
  showDialog(componentName: string, headerText: string){
    if( componentName === 'create'){
      this.dialogService.open( CreateActComponent,{
        header: headerText,
        maximizable: true,
        breakpoints: { '960px': '500px', '640px': '100vw' },
        style: { 'max-width': '100vw', width: '80vw' },
        height: '80%',
        contentStyle: { overflow: 'auto' },
        data: {
          idPatient: this.idPatient,
        }
      })
    }

    if( componentName === 'view'){
      this.dialogService.open( ViewActComponent,{
        header: headerText,
        maximizable: true,
        breakpoints: { '960px': '500px', '640px': '100vw' },
        style: { 'max-width': '100vw', width: '80vw' },
        height: '80%',
        contentStyle: { overflow: 'auto' },
        data: {
          idPatient: this.idPatient,
          idAct: this.actData.id
        }
      })
    }
  }


  //? Metodo para eliminar el acta
  deleteAct(){
    Swal.fire({
      title: '¿Estas seguro?',
      text: "No podras revertir esta acción!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar acta!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.actService.deleteAct(this.actData.id)
        .subscribe({
          next: (resp: any) => {
            Swal.fire(
              'Eliminado!',
              'El acta ha sido eliminada.',
              'success'
            )
            //Recargamos el componente
            this.ngOnDestroy();
            this.ngOnInit();
          },
          error: (err: any) => {
            Swal.fire(
              'Error!',
              'Ha ocurrido un error al eliminar el acta.',
              'error'
            )
          }
        })
      }
      if(result.isDismissed){
        Swal.fire(
          'Cancelado',
          'La acción ha sido cancelada',
          'info'
        )
      }
    })
  }


  //? Metodo para descargar el acta en pdf
  downloadPDF(){
    this.actService.downloadPDF(this.actData.id)
    .subscribe({
      next: (pdf: Blob) => {
        const url = window.URL.createObjectURL(pdf);
        window.open(url);
      },
      error: (err: any) => {
        console.error(err);
      }
    })
  }

  ngOnDestroy(): void {
    console.log(`Componente ActPage destruido`)
  }

}
