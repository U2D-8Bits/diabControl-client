import { Component, inject, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { UserDataService } from '../../services/user-data.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { User } from '../../../auth/interfaces';
import { CreateMedicComponent } from '../../components/medic/create-medic/create-medic.component';
import { ViewMedicComponent } from '../../components/medic/view-medic/view-medic.component';

@Component({
  selector: 'app-medics-page',
  templateUrl: './medics-page.component.html',
  styleUrl: './medics-page.component.css',
  providers: [ConfirmationService, MessageService, DialogService]
})
export class MedicsPageComponent implements OnInit{


  //? Variables e inyecciones
  private userService = inject( UserService)
  private userDataService = inject( UserDataService )
  private messageService = inject( MessageService )
  private dialogService = inject( DialogService)

  public medics: User[] = []
  public totalMedics: number = 0
  public currentPage: number = 1
  public pageSize: number = 10
  public search: string = ''
  id_user: number | undefined;



  //? Funcion para obtener todos los medicos
  loadMedics(){
    this.userService.getAllMedicsPaginated(this.currentPage, this.pageSize, this.search)
    .subscribe({
      next: (resp: any) => {
        this.medics = resp.medics
        this.totalMedics = resp.total
      },
      error: (err: any) => {
        this.messageService.add({severity:'error', summary:'Error', detail: err.error.msg})
      }
    })
  }


  //? Funcion para actualizar la página
  onPageChange(page: number){
    this.currentPage = page
    this.loadMedics()
  }


  //? Funcion para realizar busqueda
  onSearchChange(search: string){
    this.search = search
    this.currentPage = 1
    this.loadMedics()
  }


  //? Funcion para obtener el id de un medico
  getMedicId(id: number){
    this.id_user = id
  }


  //? Funcion para abrir el dialogo
  showDialog(component: string, headerTitle: string){
    if(component === 'create'){
      this.dialogService.open(CreateMedicComponent, {
        header: headerTitle,
        breakpoints: { '960px': '500px', '640px': '100vw' },
        style: { 'max-width': '90vw', width: '80vw' },
        height: '80%',
        contentStyle: { overflow: 'auto' },
      })
    }

    if(component === 'view'){
      this.dialogService.open(ViewMedicComponent, {
        header: headerTitle,
        breakpoints: { '960px': '500px', '640px': '100vw' },
        style: { 'max-width': '100vw', width: '80vw' },
        height: '80%',
        contentStyle: { overflow: 'auto' },
        data: {
          id_user: this.id_user
        }
      })
    }
  }


  //? Funcion para cambiar el estado de un médico
  changeStateMedic(id_user: number){
    this.userService.changeUserState(id_user)
    .subscribe({
      next: (resp: any) => {
        this.loadMedics()
        this.messageService.add({severity: 'success', summary: 'Éxito', detail: resp.msg})
      },
      error: (err: any) => {
        this.messageService.add({severity: 'error', summary: 'Error', detail: err.error.msg})
      }
    })
  }



  ngOnInit(): void {
    this.loadMedics()
    console.log(this.medics)
  }


  ngOnDestroy(): void {

  }

}
