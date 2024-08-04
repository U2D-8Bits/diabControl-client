import { computed, inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environments';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, map, Observable, of, tap, throwError } from 'rxjs';
import { User } from '../../auth/interfaces';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor() {}

  //? Variables e Inyecciones
  private readonly baseUrl: string = environment.baseUrl;
  private http = inject(HttpClient);

  //? Funciones

  //? Obtener todos los usuarios
  getAllUsers(): Observable<User[]> {
    const url = `${this.baseUrl}/users`;
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<User[]>(url, { headers }).pipe(
      map((users: User[]) => {
        return users;
      }),
      catchError((err: any) => {
        return throwError(err);
      })
    );
  }

  //? Obtener todos los usuarios de rol paciente
  getAllPatients(): Observable<User[]> {
    const url = `${this.baseUrl}/users/pacientes`;
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<User[]>(url, { headers }).pipe(
      map((users: User[]) => {
        return users;
      }),
      catchError((err: any) => {
        return throwError(err);
      })
    );
  }

  //? Obtener todos los usuarios de rol pacientes paginados
  getAllPatientsPaginated(
    page: number,
    limit: number,
    search: string
  ): Observable<any> {
    const url = `${this.baseUrl}/users/pacientes/paginated`;
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    let params = new HttpParams().set('page', page).set('limit', limit);
    if (search) {
      params = params.set('search', search);
    }

    return this.http.get<any>(url, { headers, params }).pipe(
      map((resp: any) => {
        return resp;
      }),
      catchError((err: any) => {
        return of(err);
      })
    );
  }

  //? Obtener todos los usuarios de rol medico paginados
  getAllMedicsPaginated(
    page: number,
    limit: number,
    search: string
  ): Observable<any> {
    const url = `${this.baseUrl}/users/medics/paginated`;
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    let params = new HttpParams().set('page', page).set('limit', limit);
    if (search) {
      params = params.set('search', search);
    }

    return this.http.get<any>(url, { headers, params }).pipe(
      map((resp: any) => {
        return resp;
      }),
      catchError((err: any) => {
        return of(err);
      })
    );
  }

  //? Obtener todos los usuarios de rol medico
  getAllMedics(): Observable<User[]> {
    const url = `${this.baseUrl}/users/medics`;
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<User[]>(url, { headers }).pipe(
      map((users: User[]) => {
        return users;
      }),
      catchError((err: any) => {
        return throwError(err);
      })
    );
  }

  //? Obtener un usuario por ID
  getUserById(id: number): Observable<User> {
    const url = `${this.baseUrl}/users/${id}`;
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<User>(url, { headers }).pipe(
      map((user: User) => {
        return user;
      }),
      catchError((err: any) => {
        return throwError(err);
      })
    );
  }

  //? Crear un usuario
  createUser(userData: any): Observable<User> {
    const url = `${this.baseUrl}/users`;
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.post<User>(url, userData, { headers }).pipe(
      map((user: User) => {
        return user;
      }),
      catchError((err: any) => {
        return throwError(err);
      })
    );
  }

  //? Actualizar un usuario por ID
  updateUser(id: number, userData: any): Observable<User> {
    const url = `${this.baseUrl}/users/${id}`;
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.patch<User>(url, userData, { headers }).pipe(
      map((user: User) => {
        return user;
      }),
      catchError((err: any) => {
        return throwError(err);
      })
    );
  }

  //? Actualizar perfil de usuario
  updateProfile(id: number, profileData: any): Observable<User> {
    const url = `${this.baseUrl}/users/${id}/profile`;

    return this.http.patch<User>(url, profileData).pipe(
      map((user: User) => {
        return user;
      }),
      catchError((err: any) => {
        return throwError(err);
      })
    );
  }

  //? Cambiar el estado del usuario
  changeUserState(id: number): Observable<boolean> {
    const url = `${this.baseUrl}/users/${id}/status`;
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.patch<User>(url, {}, { headers }).pipe(
      map((resp: User) => {
        return resp.user_status;
      }),
      catchError((err: any) => {
        return throwError(err);
      })
    );
  }

  //? Eliminar un usuario
  deleteUser(id: number): Observable<boolean> {
    const url = `${this.baseUrl}/users/${id}`;
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.delete<User>(url, { headers }).pipe(
      map((resp: any) => {
        return true;
      }),
      catchError((err: any) => {
        return throwError(err);
      })
    );
  }

  //? Obtener el usuario actual
  getCurrentUser(): Observable<User> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<User>(`${this.baseUrl}/auth/me`, { headers }).pipe(
      map((user: User) => {
        return user;
      }),
      catchError((err: any) => {
        return throwError(err);
      })
    );
  }


  //? Obtener los usuarios de rol paciente con busqueda
  getPatientsWithSearch(search: string = ''): Observable<User[]>{
    let params = new HttpParams();
    const url = `${this.baseUrl}/users/pacientes/search`;
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    if(search){
      params = params.append('search', search);
    }

    return this.http.get<User[]>(url, { headers, params })
    .pipe(
      map((users: User[]) => {
        return users;
      }),
      catchError((err: any) => {
        return throwError(err);
      })
    );
  }

  //? Obtener los usuarios de rol medico con busqueda
  getMedicsWithSearch(search: string = ''): Observable<User[]>{
    let params = new HttpParams();
    const url = `${this.baseUrl}/users/medicos/search`;
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    if(search){
      params = params.append('search', search);
    }

    return this.http.get<User[]>(url, { headers, params })
    .pipe(
      map((users: User[]) => {
        return users;
      }),
      catchError((err: any) => {
        return throwError(err);
      })
    );
  }
}
