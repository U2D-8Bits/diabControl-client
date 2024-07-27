import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { UserService } from '../../services/user.service';
import { User } from '../../../auth/interfaces';
import { HistoryService } from '../../services/history.service';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ControlService } from '../../services/controls/control.service';

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
  public idPatient: number = 0;
  public patientData!: User;
  patientSignals: any[] = [];
  vitalSignsData: any[] = [];

  colorScheme = {
    domain: ['#5AA454', '#E44D25', '#CFC0BB', '#7aa3e5', '#a8385d', '#aae3f5'],
  };

  legend: boolean = true;
  showLabels: boolean = true;
  animations: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  showYAxisLabel: boolean = true;
  showXAxisLabel: boolean = true;
  xAxisLabel: string = 'Fecha';
  yAxisLabel: string = 'Signos vitales';
  timeline: boolean = true;

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

  getPatientSignals() {

    this.historyService.getPatientSignals(this.idPatient)
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
      name: entry.date,
      value: entry.weight,
    }));

    const pulseSeries = this.patientSignals.map((entry) => ({
      name: entry.date,
      value: entry.pulse,
    }));

    const pressureSeries = this.patientSignals.map((entry) => ({
      name: entry.date,
      value: entry.pressure,
    }));

    const frequencySeries = this.patientSignals.map((entry) => ({
      name: entry.date,
      value: entry.frequency,
    }));

    const temperatureSeries = this.patientSignals.map((entry) => ({
      name: entry.date,
      value: entry.temperature,
    }));

    this.vitalSignsData = [
      { name: 'Peso', series: weightSeries },
      { name: 'Pulso', series: pulseSeries },
      { name: 'Presión', series: pressureSeries },
      { name: 'Frecuencia', series: frequencySeries },
      { name: 'Temperatura', series: temperatureSeries },
    ];

    console.log('VitalSignsData =>', this.vitalSignsData);
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

  ngOnInit(): void {
    this.idPatient = this.route.snapshot.params['id'];
    this.getUserData();
    this.getPatientSignals();
  }

  ngOnDestroy(): void {}
}
