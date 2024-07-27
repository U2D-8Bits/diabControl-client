import { Component, inject, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { UserDataService } from '../../services/user-data.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { User } from '../../../auth/interfaces';
import { CreateMedicComponent } from '../../components/medic/create-medic/create-medic.component';
import { ViewMedicComponent } from '../../components/medic/view-medic/view-medic.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-medics-page',
  templateUrl: './medics-page.component.html',
  styleUrl: './medics-page.component.css',
  providers: [ConfirmationService, MessageService, DialogService]
})
export class MedicsPageComponent implements OnInit{


  //? Variables e inyecciones
  ref: DynamicDialogRef | undefined;
  private userService = inject( UserService)
  private messageService = inject( MessageService )
  private dialogService = inject(DialogService);

  public medics: User[] = []
  public totalMedics: number = 0
  public currentPage: number = 1
  public pageSize: number = 10
  public search: string = ''
  id_user: number | undefined;
  idAccount: number = parseInt(localStorage.getItem('ID')!)



  //? Funcion para obtener todos los medicos
  loadMedics(){
    this.userService.getAllMedicsPaginated(this.currentPage, this.pageSize, this.search)
    .subscribe({
      next: (resp: any) => {
        this.medics = resp.data
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
      this.ref = this.dialogService.open(CreateMedicComponent, {
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
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Estás a punto de cambiar el estado de un Médico',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, cambiar estado'
    }).then((result) => {
      if(result.isConfirmed){
        //? Lógica para cambiar el estado de un paciente
        this.userService.changeUserState(id_user)
          .subscribe((resp: any) => {
            this.messageService.add({severity: 'success', summary: 'Estado cambiado', detail: "El estado del paciente ha sido cambiado"})
            // Recargar la lista de pacientes despues de 1.5 segundos
            setTimeout(() => {
              this.ngOnInit()
            }, 700)
          })
      }
    })
  }



  ngOnInit(): void {
    Swal.fire({
      title: 'Cargando Médicos',
      html: 'Por favor espere un momento',
      timer: 2500,
      timerProgressBar: true,
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading()
        this.loadMedics()
      }
    }).then((result) => {
      if(result.dismiss === Swal.DismissReason.timer){
      }
    })
  }


  ngOnDestroy(): void {

  }

}
