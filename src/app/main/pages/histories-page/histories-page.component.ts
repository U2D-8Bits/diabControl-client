import { Component, inject, OnInit } from '@angular/core';
import { HistoryService } from '../../services/history.service';
import { UserService } from '../../services/user.service';
import { ControlService } from '../../services/controls/control.service'; // Importar ControlService
import { ActivatedRoute } from '@angular/router';
import { ConfirmationService, Message, MessageService } from 'primeng/api';
import { History } from '../../interfaces/history.interface';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CreateHistoryComponent } from '../../components/histories/create-history/create-history.component';
import { User } from '../../../auth/interfaces';
import { ViewHistoryComponent } from '../../components/histories/view-history/view-history.component';
import Swal from 'sweetalert2';
import { MedicineService } from '../../services/meds/medicines.service';
import { CreateControlComponent } from '../../components/control/create-control/create-control.component';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-histories-page',
  templateUrl: './histories-page.component.html',
  styleUrls: ['./histories-page.component.css'],
  providers: [ConfirmationService, MessageService, DialogService]
})
export class HistoriesPageComponent implements OnInit {

  ref: DynamicDialogRef | undefined;

  //? Variables e Inyecciones
  private historyService = inject(HistoryService);
  private controlService = inject(ControlService); // Inyectar ControlService
  private medicineService = inject(MedicineService);
  private messageService = inject(MessageService);
  private userService = inject(UserService);
  private route = inject(ActivatedRoute);
  public dialogService = inject(DialogService);
  idPatient!: string;
  idHistory!: number;
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
  messages!: Message[];

  public historiesPatient: History[] = [];
  public totalMedicines: number = 0;
  public totalHistories: number = 0;
  public currentPage: number = 1;
  public pageSize: number = 10;

  // Agregar un mapa para almacenar el estado de los botones deshabilitados
  public controlStates: { [key: number]: boolean } = {};


  // Apartado de grafico de lineas
  colorScheme = {
    domain: ['#5AA454', '#E44D25', '#CFC0BB', '#7aa3e5', '#a8385d', '#aae3f5'],
  };
  patientSignals: any[] = [];
  vitalSignsData: any[] = [];
  Signos: boolean = true;
  showLabels: boolean = true;
  animations: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  showYAxisLabel: boolean = true;
  showXAxisLabel: boolean = true;
  xAxisLabel: string = 'Fecha';
  yAxisLabel: string = 'Signos vitales';
  legendTitle: string = 'Signos vitales';
  timeline: boolean = true;


  ngOnInit(): void {
    Swal.fire({
      title: 'Cargando Historias Clínicas',
      html: 'Por favor espere un momento',
      timer: 2500,
      timerProgressBar: true,
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading()
        this.idPatient = this.route.snapshot.params['id'];
        this.loadMedicines();
        if (this.totalMedicines === 0) {
          this.messages = [{ severity: 'info', detail: 'No se pueden crear Historias Clínicas debido a que no existen medicamentos registrados.' }];
        }
        this.loadHistories();
        this.getPatientData();
      }
    }).then((result) => {
      if (result.dismiss === Swal.DismissReason.timer) {
      }
    })
  }

  //? Metodo para obtener todos los medicamentos
  loadMedicines() {
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
  loadHistories() {
    this.historyService
      .getAllHistoriesByPatientIdWithPagination(Number(this.idPatient), this.currentPage, this.pageSize)
      .subscribe({
        next: (resp: any) => {
          this.historiesPatient = resp.data;
          if (this.historiesPatient === undefined) {
            this.historiesPatient = [];
          }
          this.totalHistories = resp.total;
          this.checkControlStates(); // Verificar el estado de control para cada historia clínica
        },
        error: (err: any) => {
          console.error(err);
        }

      })
  }

  // Método para verificar el estado de control para cada historia clínica
  checkControlStates() {
    this.historiesPatient.forEach(history => {
      this.controlService.checkControlExistence(history.id_medic_history).subscribe({
        next: (hasControl: boolean) => {
          this.controlStates[history.id_medic_history] = hasControl;
        },
        error: (err: any) => {
          console.error(err);
          this.controlStates[history.id_medic_history] = false;
        }
      });
    });
  }

  //? Metodo para cambiar de página
  onPageChange(page: number) {
    this.currentPage = page;
    this.loadHistories();
  }

  //? Metodo para obtener el id de la historia clinica
  getHistoryId(id: number) {
    this.idHistory = id;
  }

  //? Metodo para abrir el dialogo de historia clinica
  showDialog(componentName: string, headerText: string) {
    if (componentName === 'create') {
      this.ref = this.dialogService.open(CreateHistoryComponent, {
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

    if (componentName === 'view') {
      this.ref = this.dialogService.open(ViewHistoryComponent, {
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

    if (componentName === 'control') {
      this.ref = this.dialogService.open(CreateControlComponent, {
        header: headerText,
        maximizable: true,
        breakpoints: { '960px': '500px', '640px': '100vw' },
        style: { 'max-width': '100vw', width: '80vw' },
        height: '60%',
        contentStyle: { overflow: 'auto' },
        data: {
          idHistory: this.idHistory
        }
      })
    }

    //* Cerrar el dialogo
    this.ref?.onClose.subscribe((data: any) => {
      if (data) {
        this.loadHistories();
      }
    });

  }

  //? Metodo para obtener la informacion del paciente
  getPatientData() {
    this.userService.getUserById(Number(this.idPatient))
      .subscribe({
        next: (user: User) => {
          this.patientData = user;
          this.getPatientSignals();
        },
        error: (err: any) => {
          console.error(err);
        }
      })
  }

  getPatientSignals() {

    this.historyService.getPatientSignals(Number(this.idPatient))
    .subscribe({
      next: (signals) => {
        this.patientSignals = signals;
        this.prepareChartData();
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  prepareChartData(): void {
    const weightSeries = this.patientSignals.map((entry) => ({

      name: formatDate(entry.date, 'dd/MM/yyyy', 'en-US'),
      value: entry.weight,
    }));

    const pulseSeries = this.patientSignals.map((entry) => ({
      name: formatDate(entry.date, 'dd/MM/yyyy', 'en-US'),
      value: entry.pulse,
    }));

    const pressureSeries = this.patientSignals.map((entry) => ({
      name: formatDate(entry.date, 'dd/MM/yyyy', 'en-US'),
      value: entry.pressure,
    }));

    const frequencySeries = this.patientSignals.map((entry) => ({
      name: formatDate(entry.date, 'dd/MM/yyyy', 'en-US'),
      value: entry.frequency,
    }));

    const temperatureSeries = this.patientSignals.map((entry) => ({
      name: formatDate(entry.date, 'dd/MM/yyyy', 'en-US'),
      value: entry.temperature,
    }));

    this.vitalSignsData = [
      { name: 'Peso', series: weightSeries },
      { name: 'Pulso', series: pulseSeries },
      { name: 'Presión', series: pressureSeries },
      { name: 'Frecuencia', series: frequencySeries },
      { name: 'Temperatura', series: temperatureSeries },
    ];

  }

  onSelect(data: any): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
    
  }

  onActivate(data: any): void {
    console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data: any): void {
    console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }

  //? Metodo para eliminar una historia clinica
  deleteHistory(id: number) {
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
              this.messageService.add({ severity: 'success', summary: 'Historia Clínica Eliminada', detail: 'La historia clínica ha sido eliminada correctamente.' })
              this.loadHistories();
            },
            error: (err: any) => {
              if (err.error.statusCode === 500) {
                this.messageService.add({ severity: 'info', summary: 'Información', detail: 'No se puede eliminar la historia clinica debido a que tiene controles asociados.' })
              }
            }
          })
      }

      if (result.isDismissed) {
        Swal.fire(
          'Cancelado',
          'La historia clinica no ha sido eliminada',
          'error'
        )
      }

    })
  }

  ngOnDestroy(): void {
    console.log(`Componente HistoriesPage destruido`)
  }

}
