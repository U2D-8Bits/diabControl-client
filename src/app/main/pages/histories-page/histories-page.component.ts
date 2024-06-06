import { Component, inject, OnInit } from '@angular/core';
import { HistoryService } from '../../services/history.service';
import { UserService } from '../../services/user.service';
import { ActivatedRoute } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { History } from '../../interfaces/history.interface';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CreateHistoryComponent } from '../../components/histories/create-history/create-history.component';

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
  historiesPatient: History[] = [];

  ngOnInit(): void {
    console.log(`Componente HistoriesPage creado`)

    this.idPatient = this.route.snapshot.params['id'];

    this.getAllHistoriesByPatientId(this.idPatient);
  }


  //? Metodo para obtener todas las historias clinicas de un paciente
  getAllHistoriesByPatientId(id: string){

    this.historyService.getHistoriesByPatientId( Number(id) )
    .subscribe({
      next: (histories: History[]) => {
        this.historiesPatient = histories;
        console.log(`Historias del cliente Obtenidas =>`, this.historiesPatient);
      },
      error: (err: any) => {
        console.error(err);
      }
    })
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
          idPatient: this.idPatient
        }
      })
    }

    // if( componentName === 'view'){
    //   this.ref = this.dialigService.open(ViewHistoryComponent, {
    //     header: headerText,
    //     width: '40%',
    //     contentStyle: {"max-height": "500px", "overflow": "auto"},
    //   })
    // }

    //* Mostrar el componente para ver/editar un paciente
    if (this.ref) {
      this.ref.onClose.subscribe(() => {
        this.getAllHistoriesByPatientId(this.idPatient);
      });
    }
  }



  ngOnDestroy(): void {
    console.log(`Componente HistoriesPage destruido`)
  }

}
