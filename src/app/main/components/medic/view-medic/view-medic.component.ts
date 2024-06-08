import { Component, inject, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ProfilePageComponent } from '../../../pages/profile-page/profile-page.component';
import { UserService } from '../../../services/user.service';
import { FormBuilder, Validators } from '@angular/forms';
import { User } from '../../../../auth/interfaces';

@Component({
  selector: 'main-view-medic',
  templateUrl: './view-medic.component.html',
  styleUrl: './view-medic.component.css',
  providers: [ConfirmationService, MessageService],
})
export class ViewMedicComponent implements OnInit {

  private ref: DynamicDialogRef = inject(DynamicDialogRef);
  private profileComponent = inject( ProfilePageComponent)
  private dynamicDialogConfig = inject(DynamicDialogConfig);
  private userService = inject(UserService);
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);
  private fb = inject(FormBuilder);

  idMedic!: number;
  medicDefaultData!: User;
  presentYear = new Date().getFullYear();
  ageUser!: number;

  medicForm = this.fb.group({
    user_username: ['', Validators.required],
    user_status: [true],
    user_phone: ['', Validators.required],
    user_password: ['', [Validators.required, Validators.minLength(6)]],
    user_name: ['', Validators.required],
    user_lastname: ['', Validators.required],
    user_genre: ['', [Validators.required]],
    user_email: ['', [Validators.required]],
    user_ced: ['', [Validators.required]],
    user_birthdate: ['', [Validators.required]],
    user_age: [0, [Validators.required]],
    user_admin: [false],
    user_address: ['', [Validators.required]],
    role_id: [1],
  })

  ngOnInit(): void {
    console.log(`Componente ViewMedic creado`);

    this.idMedic = Number(this.dynamicDialogConfig.data.idMedic);

    this.getMedicData();
  }


  //? Metodo para obtener la informacion del medico
  getMedicData(){
    this.userService.getUserById(this.idMedic)
      .subscribe({
        next: (data) => {
          this.medicForm.patchValue(data);
          this.ageUser = this.presentYear - new Date(data.user_birthdate).getFullYear();
          this.medicDefaultData = data;
        },
        error: (err) => {
          console.error(err);
        }
      })
  }

  //? Metodo para actualizar la informacion del medico
  updateMedic(){
    const idMedico = this.idMedic;
    

    const birthDateYear = this.medicForm.get('user_birthdate')?.value?.split('-')[0] || '';
    this.ageUser = this.presentYear - parseInt(birthDateYear);
    this.medicForm.patchValue({
      user_age: this.ageUser,
    });

    const medicData = this.medicForm.value;

    this.confirmationService.confirm({
      message: `¿Está seguro que desea actualizar la información del medico?`,
      accept: () => {
        this.userService.updateUser(idMedico, medicData)
          .subscribe({
            next: (data) => {
              this.messageService.add({ severity: 'success', summary: '¡Éxito!', detail: 'Medico actualizado correctamente' });
              this.profileComponent.ngOnInit();
              this.medicForm.markAsPristine();
              this.ref?.close(data);
            },
            error: (err) => {
              this.messageService.add({ severity: 'error', summary: '¡Error!', detail: 'No se pudo actualizar la información del medico' });
              console.error(err);
            }
          })
      },
      reject: () => {
        this.messageService.add({ severity: 'info', summary: 'Operación cancelada', detail: 'No se ha actualizado la información del medico' });
      }
    })
  }


  //? Metodo para cancelar la actualizacion del medico
  cancelUpdate(){
    this.confirmationService.confirm({
      message: '¿Esta seguro que desea cancelar la actualización de la Historia?',
      header: 'Cancelar Actualización',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: 'pi pi-check',
      rejectIcon: 'pi pi-times',
      accept: () => {
        this.medicForm.patchValue(this.medicDefaultData);
        this.messageService.add({
          severity: 'info',
          summary: 'Actualización Cancelada',
          detail: 'La actualización de la Historia ha sido cancelada',
        });
        this.medicForm.markAsPristine();
        this.closeDialog();
      },
      reject: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Operación Cancelada',
          detail: 'La operación ha sido cancelada',
        });
      }
    })
  }

  //? Metodo para cerrar el dialogo
  closeDialog(){
    this.ref?.close();
  }

  ngOnDestroy(){
    console.log(`Componente ViewMedic destruido`);
  }

}
