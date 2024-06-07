import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { ActivatedRoute } from '@angular/router';
import { User } from '../../../auth/interfaces';

@Component({
  selector: 'app-act-page',
  templateUrl: './act-page.component.html',
  styleUrl: './act-page.component.css'
})
export class ActPageComponent implements OnInit, OnDestroy {

  //? Variables e Inyecciones
  private userService = inject(UserService);
  private route = inject( ActivatedRoute )
  private idPatient!: number;
  public patientData!: User;

  
  ngOnInit(): void {
    console.log(`Componente ActPage creado`)

    this.idPatient = Number(this.route.snapshot.params['id']);

    this.getPatientData();
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


  ngOnDestroy(): void {
    console.log(`Componente ActPage destruido`)
  }

}
