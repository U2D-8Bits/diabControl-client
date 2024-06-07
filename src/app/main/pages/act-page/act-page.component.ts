import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { ActivatedRoute } from '@angular/router';
import { User } from '../../../auth/interfaces';
import { ActService } from '../../services/act.service';
import { ActInterface } from '../../interfaces/acts/act.interface';

@Component({
  selector: 'app-act-page',
  templateUrl: './act-page.component.html',
  styleUrl: './act-page.component.css'
})
export class ActPageComponent implements OnInit, OnDestroy {

  //? Variables e Inyecciones
  private userService = inject(UserService);
  private actService = inject(ActService);
  private route = inject( ActivatedRoute )
  private idPatient!: number;
  public patientData!: User;
  public actData!: ActInterface;

  
  ngOnInit(): void {
    console.log(`Componente ActPage creado`)

    this.idPatient = Number(this.route.snapshot.params['id']);

    this.getPatientData();
    this.getActaByPatientId();
  }


  //? Metodo para obtener los datos del paciente
  getPatientData(){
    this.userService.getUserById( this.idPatient)
    .subscribe({
      next: (user: User) => {
        this.patientData = user;
        console.log(`data recivida:`, this.patientData)
      },
      error: (err: any) => {
        console.error(err);
      }
    })
  }


  //? Metodo para obtener el acta del paciente
  getActaByPatientId(){
    this.actService.getActByPatientId(this.idPatient)
    .subscribe({
      next: (act: ActInterface) => {
        this.actData = act;
        console.log(`data recivida:`, this.actData)
      },
      error: (err: any) => {
        console.error(err);
      }
    })
  }


  ngOnDestroy(): void {
    console.log(`Componente ActPage destruido`)
  }

}
