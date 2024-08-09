import { Component, Inject, inject, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../../auth/interfaces';
import { ConfirmationService, MessageService } from 'primeng/api';

import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';

import Swal from 'sweetalert2'
import { CreatePatientComponent } from '../../components/patient/create-patient/create-patient.component';
import { ViewPatientComponent } from '../../components/patient/view-patient/view-patient.component';
import { UserDataService } from '../../services/user-data.service';

@Component({
  selector: 'app-patients-page',
  templateUrl: './patients-page.component.html',
  styleUrl: './patients-page.component.css',
  providers: [ConfirmationService, MessageService, DialogService]
})
export class PatientsPageComponent implements OnInit{

  //? Variables e Injecciones
  private userService = inject( UserService)
  private userDataService = inject( UserDataService)
  private confirmationService = inject( ConfirmationService)
  private messageService = inject( MessageService)
  public dialigService = inject( DialogService )

  

  

  public patients: User[] = []
  public totalPatients: number = 0
  public currentPage: number = 1
  public pageSize: number = 10
  public search: string = ''




  //? Funcion para abrir el dialogo de agregar paciente
  showDialog(componentName: string, headerText: string) {
    //* Mostrar el compomente de agregar paciente
    if( componentName === 'create'){
      this.dialigService.open(CreatePatientComponent, {
        header: headerText,
        breakpoints: { '960px': '500px', '640px': '100vw' },
        style: { 'max-width': '90vw', width: '80vw' },
        height: '80%',
        contentStyle: { overflow: 'auto' },
      })
    }

    if( componentName === 'view'){
      this.dialigService.open(ViewPatientComponent, {
        header: headerText,
        breakpoints: { '960px': '500px', '640px': '100vw' },
        style: { 'max-width': '100vw', width: '80vw' },
        height: '80%',
        contentStyle: { overflow: 'auto' },
      })
    }
  }





  //? Funcion para enviar el ID del paciente a traves de un observable
  sendUserID(id_user: number){
    this.userDataService.changeUserId(id_user)
  }



  //? Funcion para cargar los pacientes paginados
  loadPatients(){
    this.userService.getAllPatientsPaginated(this.currentPage, this.pageSize, this.search)
    .subscribe({
      next: (resp: any) => {
        this.patients = resp.data
        this.totalPatients = resp.total
      },
      error: (err: any) => {
        this.messageService.add({severity: 'error', summary: 'Error', detail: 'Ha ocurrido un error al cargar los pacientes'})

      },
    })
  }

  onSearchChange(search: string){
    this.search = search
    this.currentPage = 1
    this.loadPatients()
  }

  onPageChange(page: number){
    this.currentPage = page
    this.loadPatients()
  }



  //? Funcion para modificar el estado de un paciente
  changeStatePatient(id_user: number){
     Swal.fire({
        title: '¿Estás seguro?',
        text: 'Estás a punto de cambiar el estado de un paciente',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, cambiar estado',
        cancelButtonText: 'Cancelar'
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



  //? Funcion para eliminar un paciente
  deletePatient(id_user: number){
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Estás a punto de eliminar un paciente',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar paciente',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if(result.isConfirmed){
        //? Lógica para eliminar un paciente
        this.userService.deleteUser(id_user)
          .subscribe({
            next: (resp: any) => {
              this.messageService.add({severity: 'success', summary: 'Paciente eliminado', detail: 'El paciente ha sido eliminado'})
              setTimeout(() => {
                this.ngOnInit()
              }, 700)
            },
            error: (err: any) => {
              if(err.error.statusCode === 500 ){
                this.messageService.add({severity: 'info', summary: 'Información', detail: 'No se puede eliminar un paciente con archivos o documentos asociadas'})
              }
            }
          
          })
      }
    })
  }




  ngOnInit(): void {
    Swal.fire({
      title: 'Cargando pacientes',
      html: 'Por favor espere un momento',
      timer: 2500,
      timerProgressBar: true,
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading()
        this.loadPatients()
      }
    }).then((result) => {
      if(result.dismiss === Swal.DismissReason.timer){
      }
    })
    
  }

  
}
