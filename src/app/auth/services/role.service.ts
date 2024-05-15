import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environments';
import { HttpClient } from '@angular/common/http';
import { Role } from '../interfaces';
import { catchError, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  constructor() { }

  //? Variables e Inyecciones
  private readonly baseUrl: string = environment.baseUrl;
  private http = inject(HttpClient);
  private _currentRole = signal<Role | null>(null);

  //? Variables publicas computadas
  
  public currentRole = computed(() => this._currentRole());


  //? Funciones

  //* Metodo para obtener un role por ID
  getRoleByID(role_id: number): Observable<Role>{
    const url = `${this.baseUrl}/roles/${role_id}`;
    return this.http.get<Role>(url)
      .pipe(
        map((role) => { 
          console.log("Rol obtenido =>", role)
          this._currentRole.set(role); 
          localStorage.setItem('role', role.role_name);
          return role; 
        }),
        catchError((err) => { throw err.error.message; })
      )
  }
}
