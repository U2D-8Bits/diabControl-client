import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { UserService } from '../../services/user.service';
import { User } from '../../../auth/interfaces';
import { HistoryService } from '../../services/history.service';

@Component({
  selector: 'app-control-page',
  templateUrl: './control-page.component.html',
  styleUrl: './control-page.component.css',
  providers: [ConfirmationService, MessageService, DialogService],
})
export class ControlPageComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private userService = inject(UserService);
  private historiesService = inject(HistoryService);
  public idPatient: number = 0;
  public patientData!: User;
  patientSignals: any[] = [];
  vitalSignsData: any[] = [];

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
    this.historiesService.getPatientSignals(this.idPatient).subscribe({
      next: (signals) => {
        this.patientSignals = signals;
        console.log("PatientSignals =>",this.patientSignals);
        this.prepareChartData();
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  prepareChartData(): void {
    const weightSeries = this.patientSignals.map(entry => ({
      name: entry.date,
      value: entry.weight
    }));

    const pulseSeries = this.patientSignals.map(entry => ({
      name: entry.date,
      value: entry.pulse
    }));

    const pressureSeries = this.patientSignals.map(entry => ({
      name: entry.date,
      value: entry.pressure
    }));

    const frequencySeries = this.patientSignals.map(entry => ({
      name: entry.date,
      value: entry.frequency
    }));

    const temperatureSeries = this.patientSignals.map(entry => ({
      name: entry.date,
      value: entry.temperature
    }));

    this.vitalSignsData = [
      { name: 'Peso', series: weightSeries },
      { name: 'Pulso', series: pulseSeries },
      { name: 'Presión', series: pressureSeries },
      { name: 'Frecuencia', series: frequencySeries },
      { name: 'Temperatura', series: temperatureSeries }
    ];

    console.log("VitalSignsData =>",this.vitalSignsData);
  }

  ngOnInit(): void {
    this.idPatient = this.route.snapshot.params['id'];
    this.getUserData();
    this.getPatientSignals();
  }

  ngOnDestroy(): void {}
}
