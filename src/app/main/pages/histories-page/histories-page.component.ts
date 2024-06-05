import { Component, inject, OnInit } from '@angular/core';
import { HistoryService } from '../../services/history.service';
import { UserService } from '../../services/user.service';
import { ActivatedRoute } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-histories-page',
  templateUrl: './histories-page.component.html',
  styleUrl: './histories-page.component.css',
  providers: [ConfirmationService, MessageService]
})
export class HistoriesPageComponent implements OnInit {

  //? Variables e Inyecciones
  private historyService = inject( HistoryService);
  private userService = inject(UserService);
  private route = inject( ActivatedRoute);
  idPatient!: string;

  ngOnInit(): void {
    console.log(`Componente HistoriesPage creado`)

    this.idPatient = this.route.snapshot.params['id'];

    console.log(`Id del paciente recibido: ${this.idPatient}`);
  }


  ngOnDestroy(): void {
    console.log(`Componente HistoriesPage destruido`)
  }

}
