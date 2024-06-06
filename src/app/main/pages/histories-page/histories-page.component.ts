import { Component, inject, OnInit } from '@angular/core';
import { HistoryService } from '../../services/history.service';
import { UserService } from '../../services/user.service';
import { ActivatedRoute } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { History } from '../../interfaces/history.interface';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CreateHistoryComponent } from '../../components/histories/create-history/create-history.component';
import { User } from '../../../auth/interfaces';
import { ViewHistoryComponent } from '../../components/histories/view-history/view-history.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-histories-page',
  templateUrl: './histories-page.component.html',
  styleUrl: './histories-page.component.css',
  providers: [ConfirmationService, MessageService, DialogService]
})
export class HistoriesPageComponent implements OnInit {

  ref: DynamicDialogRef | undefined;

  //? Variables e Inyecciones
  private historyService = inject( HistoryService);
  private userService = inject(UserService);
  private route = inject( ActivatedRoute);
  public dialigService = inject( DialogService )
  idPatient!: string;
  idHistory!: number;
  patientData!: User;
  historiesPatient: History[] = [];

  ngOnInit(): void {
    console.log(`Componente HistoriesPage creado`)

    this.idPatient = this.route.snapshot.params['id'];

    this.getAllHistoriesByPatientId(this.idPatient);
    this.getPatientData();
  }


  //? Metodo para obtener todas las historias clinicas de un paciente
  getAllHistoriesByPatientId(id: string){

    this.historyService.getHistoriesByPatientId( Number(id) )
    .subscribe({
      next: (histories: History[]) => {
        this.historiesPatient = histories;
      },
      error: (err: any) => {
        console.error(err);
      }
    })
  }

  //? Metodo para obtener el id de la historia clinica
  getHistoryId(id: number){
    this.idHistory = id;
  }

  //? Metodo para abrir el dialogo de historia clinica
  showDialog(componentName: string, headerText: string) {
    //* Mostrar el compomente de agregar paciente
    if( componentName === 'create'){
      this.ref = this.dialigService.open(CreateHistoryComponent, {
        header: headerText,
        maximizable: true,
        breakpoints: { '960px': '500px', '640px': '100vw' },
        style: { 'max-width': '100vw', width: '80vw' },
        height: '80%',
        contentStyle: { overflow: 'auto' },
        data: {
          idPatient: this.idPatient,
          idHistory: this.idHistory
        }
      })
    }


    if( componentName === 'view'){
      this.ref = this.dialigService.open(ViewHistoryComponent, {
        header: headerText,
        maximizable: true,
        breakpoints: { '960px': '500px', '640px': '100vw' },
        style: { 'max-width': '100vw', width: '80vw' },
        height: '80%',
        contentStyle: { overflow: 'auto' },
        data: {
          idPatient: this.idPatient,
          idHistory: this.idHistory
        }
      })
    }

    //* Mostrar el componente para ver/editar un paciente
    if (this.ref) {
      this.ref.onClose.subscribe(() => {
        this.getAllHistoriesByPatientId(this.idPatient);
      });
    }
  }

  //? Metodo para obtener la informacion del paciente
  getPatientData(){
    this.userService.getUserById( Number(this.idPatient))
    .subscribe({
      next: (user: User) => {
        this.patientData = user;
      },
      error: (err: any) => {
        console.error(err);
      }
    })
  }

  //? Metodo para eliminar una historia clinica
  deleteHistory(id: number){
    Swal.fire({
      title: '¿Estas seguro?',
      text: "No podras revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, borrar!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.historyService.deleteHistory(id)
        .subscribe({
          next: (resp: any) => {
            Swal.fire(
              'Borrado!',
              'La historia clinica ha sido eliminada.',
              'success'
            )
            this.getAllHistoriesByPatientId(this.idPatient);
          },
          error: (err: any) => {
            Swal.fire(
              'Error!',
              'Ha ocurrido un error al eliminar la historia clinica.',
              'error'
            )
          }
        })
      }
    
    })
  }



  ngOnDestroy(): void {
    console.log(`Componente HistoriesPage destruido`)
  }

}
