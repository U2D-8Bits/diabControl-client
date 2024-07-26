import { Component, inject, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { UserDataService } from '../../services/user-data.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { User } from '../../../auth/interfaces';

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






  ngOnInit(): void {
    console.log('Medics Page =>', this.loadMedics())
  }


  ngOnDestroy(): void {

  }

}
