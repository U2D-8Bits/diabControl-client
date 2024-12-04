import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { UserService } from '../../services/user.service';
import { User } from '../../../auth/interfaces';
import { HistoryService } from '../../services/history.service';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ControlService } from '../../services/controls/control.service';
import { Control } from '../../interfaces/controls/control.interface';
import { UpdateControlComponent } from '../../components/control/update-control/update-control.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-control-page',
  templateUrl: './control-page.component.html',
  styleUrl: './control-page.component.css',
  providers: [ConfirmationService, MessageService, DialogService],
})
export class ControlPageComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private userService = inject(UserService);
  private controlService = inject(ControlService);
  private historyService = inject(HistoryService);
  private dialogService = inject(DialogService);
  public idPatient: number = 0;
  public idControl: number = 0;
  patientData: User = {
    id_user: 0,
    user_address: '',
    user_email: '',
    user_name: '',
    user_password: '',
    user_phone: '',
    user_admin: false,
    user_age: 0,
    user_birthdate: '',
    user_ced: '',
    user_created_at: new Date(),
    user_genre: '',
    user_lastname: '',
    user_status: false,
    user_updated_at: new Date(),
    user_username: '',
    role_id: 0
  };

  public controlPatient: Control[] = [];
  public totalControls: number = 0;
  public currentPage: number = 1;
  public pageSize: number = 10;

  getUserData() {
    this.userService.getUserById(this.idPatient).subscribe({
      next: (userData) => {
        this.patientData = userData;
      },
      error: (error) => {
        console.error(error);
      },
    });
  }




  //? Funcion para obtener todos los controles de un paciente con paginación
  loadControls(){
    this.controlService.getControlsByPatientId(this.idPatient, this.currentPage, this.pageSize)
    .subscribe({
      next: (resp: any) => {
        this.controlPatient = resp.data;
        if (this.controlPatient === undefined) {
          this.controlPatient = [];
        }
        this.totalControls = resp.total;
      },
      error: (err: any) => {
        console.error(err);
      }
    })
  }

  //? Metodo para cambiar de página
  onPageChange(page: number) {
    this.currentPage = page;
    this.loadControls();
  }

  showDialog(component: string, headerTitle: string){
    if( component === 'view'){
      this.dialogService.open(UpdateControlComponent, {
        header: headerTitle,
        maximizable: true,
        breakpoints: { '960px': '500px', '640px': '100vw' },
        style: { 'max-width': '100vw', width: '80vw' },
        height: '60%',
        contentStyle: { overflow: 'auto' },
        data: {
          idControl: this.idControl
        }
      })
    }
  }

  getIdControl(id: number){
    this.idControl = id;
  }

  deleteControl(id: number){
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Una vez eliminado, no podrás recuperar este control',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.controlService.deleteControl(id)
        .subscribe({
          next: (resp: any) => {
            Swal.fire(
              'Eliminado!',
              'El control ha sido eliminado.',
              'success'
            )
            this.loadControls();
          },
          error: (err: any) => {
            console.error(err);
            Swal.fire(
              'Error!',
              'El control no ha podido ser eliminado.',
              'error'
            )
          }
        })
      }
    })
  }

  ngOnInit(): void {
    Swal.fire({
      title: 'Cargando Seguimientos',
      html: 'Por favor espere un momento',
      timer: 2500,
      timerProgressBar: true,
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading()
        this.idPatient = this.route.snapshot.params['id'];
        this.getUserData();
        this.loadControls();
      }
    }).then((result) => {
      if (result.dismiss === Swal.DismissReason.timer) {
      }
    })
  }

  ngOnDestroy(): void {}
}
