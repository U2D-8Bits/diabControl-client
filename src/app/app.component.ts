import { Component, computed, effect, inject, OnInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { AuthService } from './auth/services/auth.service';
import { Router } from '@angular/router';
import { AuthStatus } from './auth/enums/auth-status.enum';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {


  //? Variables e Injecciones
  private primengConfig = inject(PrimeNGConfig);
  private authService = inject(AuthService);
  private router = inject(Router);





  //? Metodo para chequear el estado de autenticacion
  public finishAuthCheck = computed<boolean>( () => {

    if( this.authService.authStatus() === AuthStatus.checking){
      return false
    }
    return true;
  });





  //? Metodo para verificar el cambio de estado de autenticacion
  public authStatusChangedEffect = effect ( () =>{

    switch( this.authService.authStatus() ){

      case AuthStatus.checking:
        return;

      case AuthStatus.authenticated:
        this.router.navigateByUrl('/main')
        return;

      case AuthStatus.notAuthenticated:
        this.router.navigateByUrl('/auth')
        return;
    }
  });





  //? NgOnInit
  ngOnInit() {
      this.primengConfig.ripple = true;
  }
  
  
}
