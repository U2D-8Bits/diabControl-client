import { computed, inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environments';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, Observable, tap, throwError } from 'rxjs';
import { User } from '../../auth/interfaces';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor() { }

  //? Variables e Inyecciones
  private readonly baseUrl: string = environment.baseUrl;
  private http = inject( HttpClient);

  //? Funciones





  //? Obtener todos los usuarios
  getAllUsers(): Observable<User[]>{
    const url = `${this.baseUrl}/users`;
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    
     return this.http.get<User[]>(url, {headers})
     .pipe(
       map((users: User[]) => {
         return users 
       }),
       catchError((err: any) => {
         return throwError(err);
       })
     );
  }





  //? Obtener todos los usuarios de rol paciente
  getAllPatients(): Observable<User[]>{

    const url = `${this.baseUrl}/users/pacientes`;
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<User[]>(url, {headers})
    .pipe(
      map((users: User[]) => {
        return users
      }),
      catchError((err: any) => {
        return throwError(err);
      })
    );
  }




  //? Obtener todos los usuarios de rol medico
  getAllMedics(): Observable<User[]>{
    const url = `${this.baseUrl}/users/medics`;
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<User[]>(url, {headers})
    .pipe(
      map((users: User[]) => {
        return users
      }),
      catchError((err: any) => {
        return throwError(err);
      })
    );
  }




  //? Obtener un usuario por ID
  getUserById(id: number): Observable<User>{
    const url = `${this.baseUrl}/users/${id}`;
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<User>(url, {headers})
    .pipe(
      map((user: User) => {
        return user
      }),
      catchError((err: any) => {
        return throwError(err);
      })
    );
  }





  //? Crear un usuario
  createUser(userData: any): Observable<User>{
    const url= `${this.baseUrl}/users`;
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.post<User>(url, userData, {headers})
    .pipe(
      map((user: User) => {
        return user
      }),
      catchError((err: any) => {
        return throwError(err);
      })
    );
  }





  //? Actualizar un usuario por ID
  updateUser(id: number, userData: any): Observable<User>{
    const url = `${this.baseUrl}/users/${id}`;
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.patch<User>(url, userData, {headers})
    .pipe(
      map((user: User) => {
        return user
      }),
      catchError((err: any) => {
        return throwError(err);
      })
    );
  }





  //? Cambiar el estado del usuario
  changeUserState(id: number): Observable<boolean>{
    const url = `${this.baseUrl}/users/${id}/status`;
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.patch<User>(url, {}, {headers})
    .pipe(
      map((resp: User) => {
        return resp.user_status
      }),
      catchError((err: any) => {
        return throwError(err);
      })
    );
  }





  //? Eliminar un usuario
  deleteUser(id: number): Observable<boolean>{
    const url = `${this.baseUrl}/users/${id}`;
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.delete<User>(url, {headers})
    .pipe(
      map((resp: any) => {
        return true
      }),
      catchError((err: any) => {
        return throwError(err);
      })
    );
  }
}
