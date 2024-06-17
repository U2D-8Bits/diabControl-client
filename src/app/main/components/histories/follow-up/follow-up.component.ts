import { Component, inject, OnInit } from '@angular/core';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { HistoryService } from '../../../services/history.service';
import { History } from '../../../interfaces/history.interface';
import { UserService } from '../../../services/user.service';
import { User } from '../../../../auth/interfaces/user.interface';

@Component({
  selector: 'app-follow-up',
  templateUrl: './follow-up.component.html',
  styleUrl: './follow-up.component.css'
})
export class FollowUpComponent implements OnInit{

  //? Variables e Inyecciones
  private ref: DynamicDialogRef = inject(DynamicDialogRef);
  private dynamicDialogConfig = inject(DynamicDialogConfig);
  private historiesService = inject(HistoryService);
  private userService = inject(UserService);
  private idPatient: number = 0;
  public histories: History[] = [];
  public userData: User | undefined;

  ngOnInit(): void {
    this.idPatient = this.dynamicDialogConfig.data.idPatient;
    this.getHistories();
    this.getUserData();
  }

  //? Método para obtener la data del paciente
  getUserData(){
    this.userService.getUserById(this.idPatient)
    .subscribe({
      next: (userData: User) => {
        this.userData = userData;
      },
      error: (err: any) => {
        console.error(err);
      }
    })
  }

  //? Metodo para obtener todas las historias clinicas de un paciente
  getHistories(){
    
    this.historiesService.getHistoriesByPatientId( this.idPatient )
    .subscribe({
      next: (historiesData: History[]) => {
        this.histories = historiesData;
        console.log(this.histories);
      },
      error: (err: any) => {
        console.error(err);
      }
    })

  }



  ngOnDestroy(): void {

  }

}
