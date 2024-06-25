import { Component, inject, OnInit } from '@angular/core';
import { HistoryService } from '../../services/history.service';
import { UserService } from '../../services/user.service';
import { ActivatedRoute } from '@angular/router';
import { ConfirmationService, Message, MessageService } from 'primeng/api';
import { History } from '../../interfaces/history.interface';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CreateHistoryComponent } from '../../components/histories/create-history/create-history.component';
import { User } from '../../../auth/interfaces';
import { ViewHistoryComponent } from '../../components/histories/view-history/view-history.component';
import Swal from 'sweetalert2';
import { FollowUpComponent } from '../../components/histories/follow-up/follow-up.component';
import { MedicineService } from '../../services/meds/medicines.service';
import { Medicine } from '../../interfaces/Medicines/medicines.interface';

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
  private medicineService = inject( MedicineService );
  private userService = inject(UserService);
  private route = inject( ActivatedRoute);
  public dialigService = inject( DialogService );
  idPatient!: string;
  idHistory!: number;
  patientData!: User;
  messages!: Message[];

  public historiesPatient: History[] = [];
  public totalMedicines: number = 0;

  public totalHistories: number = 0;
  public currentPage: number = 1;
  public pageSize: number = 10;

  ngOnInit(): void {
    console.log(`Componente HistoriesPage creado`)

    this.idPatient = this.route.snapshot.params['id'];
    this.loadMedicines();
    if(this.totalMedicines === 0){
      this.messages = [{ severity: 'info', detail: 'No se pueden crear Historias Clínicas debido a que no existen medicamentos registrados.' }];
    }
    this.loadHistories();
    this.getPatientData();
  }


  //? Metodo para obtener todos los medicamentos
  loadMedicines(){
    this.medicineService.getMedicinesCount()
    .subscribe({
      next: (count: number) => {
        this.totalMedicines = count;
      },
      error: (err: any) => {
        console.error(err);
      }
    })
  }


  //? Método para obtener todas las historias médicas de un paciente por ID con paginación
  loadHistories(){
    this.historyService
    .getAllHistoriesByPatientIdWithPagination( Number(this.idPatient), this.currentPage, this.pageSize)
    .subscribe({
      next: (resp: any) => {
        this.historiesPatient = resp.data;
        if(this.historiesPatient === undefined){
          this.historiesPatient = [];
        }
        this.totalHistories = resp.total;
      },
      error: (err: any) => {
        console.error(err);
      }
    
    })
  }


  //? Metodo para cmabiar de página
  onPageChange(page: number){
    this.currentPage = page;
    this.loadHistories();
  }



  //? Metodo para obtener el id de la historia clinica
  getHistoryId(id: number){
    this.idHistory = id;
  }

  //? Metodo para abrir el dialogo de historia clinica
  showDialog(componentName: string, headerText: string) {
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

    if( componentName === 'control'){
      this.ref = this.dialigService.open(FollowUpComponent, {
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

    //* Cerrar el dialogo
    this.ref?.onClose.subscribe((data: any) => {
      if(data){
        this.loadHistories();
      }
    });

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
            this.ngOnInit();
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
