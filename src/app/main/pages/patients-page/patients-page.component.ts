import { Component, Inject, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../../auth/interfaces';
import { ConfirmationService, MessageService } from 'primeng/api';

import Swal from 'sweetalert2'

@Component({
  selector: 'app-patients-page',
  templateUrl: './patients-page.component.html',
  styleUrl: './patients-page.component.css',
  providers: [ConfirmationService, MessageService]
})
export class PatientsPageComponent implements OnInit{

  

  constructor() { }

  //? Variables e Injecciones
  private userService = inject( UserService)
  private confirmationService = inject( ConfirmationService)
  private messageService = inject( MessageService)



  public patients: User[] = []





  //? Funcion para obtener los pacientes
  getAllPatients(){
    //? Lógica para obtener todos los pacientes
    this.userService.getAllPatients()
      .subscribe((resp: User[]) => {
        this.patients = resp
      })
  }





  //? Funcion para modificar el estado de un paciente
  changeStatePatient(id_user: number, event: Event){
     Swal.fire({
        title: '¿Estás seguro?',
        text: 'Estás a punto de cambiar el estado de un paciente',
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





  //? Funcion para eliminar un paciente





  ngOnInit(): void {
    this.getAllPatients()
  }





  ngOnDestroy(): void {
    console.log('Componente de pacientes destruido')
  }

}
