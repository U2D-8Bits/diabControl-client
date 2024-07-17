import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environments';

import { AuthStatus } from '../enums/auth-status.enum';

import { CheckTokenResponse, LoginResponse, User } from '../interfaces';
import { catchError, map, Observable, of, throwError} from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RoleService } from './role.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  //? Constructor
  constructor() {
    this.checkAuthStatus().subscribe();
  }


  //? Variables e Inyecciones
  private readonly baseUrl: string = environment.baseUrl;
  private http = inject(HttpClient);
  private roleService = inject( RoleService );
  private router = inject(Router);

  private _currentUser = signal<User | null>(null);
  private _authStatus = signal<AuthStatus>(AuthStatus.checking);

  public currentUser = computed(() => this._currentUser());
  public authStatus = computed(() => this._authStatus());

  

  //? Funciones

  //* Metodo para guardar informacion de autenticacion
  private saveData(user: User, token: string): boolean {
    this.roleService.getRoleByID(user.role_id).subscribe();
    this._currentUser.set(user);
    this._authStatus.set(AuthStatus.authenticated);

    localStorage.setItem('token', token);
    localStorage.setItem('user_name', `${user.user_name} ${user.user_lastname}`);
    localStorage.setItem('roleID', user.role_id.toString());
    localStorage.setItem('nameUser', user.user_name.toString());
    localStorage.setItem('isAdmin', user.user_admin.toString());
    localStorage.setItem('ID', user.id_user.toString());

    return true;
  }






  //* Metodo para loguearse
  login(user_username: string, user_password: string): Observable<boolean> {
    const url = `${this.baseUrl}/users/login`;
    const body = { user_username, user_password };

    return this.http.post<LoginResponse>(url, body).pipe(
      map(({ user, token }) => {
        this.saveData(user, token);
        this.showLoadingScreen();
        setTimeout(() => {
          this.router.navigate(['/main']);
          this.hideLoadingScreen();
        }, 3000); // 3 segundos de espera simulada
        return true;
      }),
      catchError((err) => throwError(() => err.error.message))
    );
  }




  //* Metodo para cerrar sesion
  logOut(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user_name');
    localStorage.removeItem('nameUser');
    localStorage.removeItem('role');
    this._currentUser.set(null);
    this._authStatus.set(AuthStatus.notAuthenticated);
  }





  //* Metodo para verificar el token de acceso
  checkAuthStatus(): Observable<boolean>{

    const url = `${this.baseUrl}/users/check-token`;
    const token = localStorage.getItem('token');

    if(!token){
      this.logOut();
      return of(false)
    };

    const headers = new HttpHeaders()
     .set('Authorization', `Bearer ${token}`);

    return this.http.get<CheckTokenResponse>(url, { headers })
      .pipe(
        map(({ user, token }) => this.saveData(user, token)),
        catchError( () => {
          this._authStatus.set(AuthStatus.notAuthenticated);
          return of(false);
        })
      )
  }

  //* Metodo para restablecer la contraseña
  resetPassword(user_email: string): Observable<boolean> {
    const url = `${this.baseUrl}/users/reset-password`;

    return this.http.post(url, { user_email }).pipe(
      map(() => true),
      catchError((err) => throwError(() => err.error.message))
    );
  }


  showLoadingScreen(): void {
    document.getElementById('loadingScreen')!.style.display = 'flex';
  }

  hideLoadingScreen(): void {
    document.getElementById('loadingScreen')!.style.display = 'none';
  }


}
