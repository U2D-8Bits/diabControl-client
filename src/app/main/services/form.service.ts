import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environments';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { Form } from '../interfaces/form.interface';

@Injectable({
  providedIn: 'root'
})
export class FormService {

  constructor() { }

    //? Variables e Inyecciones
    private readonly baseUrl: string = environment.baseUrl;
    private http = inject( HttpClient);


    //? Funciones


    //? Funcion para obtener todos los formularios existentes
    getAllForms(): Observable<Form[]>{
      const url = `${this.baseUrl}/forms`;
      
       return this.http.get<Form[]>(url)
       .pipe(
         map((forms: Form[]) => {
           return forms 
         }),
         catchError((err: any) => {
           return throwError(err);
         })
       );
    }


    //? Funcion para obtener los formularios de un usuario
    getFormsByUser(id: number): Observable<Form[]>{
      const url = `${this.baseUrl}/forms/user/${id}`;
      
       return this.http.get<Form[]>(url)
       .pipe(
         map((forms: Form[]) => {
           return forms 
         }),
         catchError((err: any) => {
           return throwError(err);
         })
       );
    }



    //? Funcion para obtener un formulario por su id
    getFormById(id: number): Observable<Form>{
      const url = `${this.baseUrl}/forms/${id}`;
      
       return this.http.get<Form>(url)
       .pipe(
         map((form: Form) => {
           return form 
         }),
         catchError((err: any) => {
           return throwError(err);
         })
       );
    }



    //? Funcion para crear un nuevo formulario
    createForm(form: Form): Observable<Form>{
      const url = `${this.baseUrl}/forms`;
      
       return this.http.post<Form>(url, form)
       .pipe(
         map((form: Form) => {
           return form 
         }),
         catchError((err: any) => {
           return throwError(err);
         })
       );
    }



    //? Funcion para actualizar un formulario
    updateForm(id:number,form: Form): Observable<Form>{
      const url = `${this.baseUrl}/forms/${id}`;
      
       return this.http.put<Form>(url, form)
       .pipe(
         map((form: Form) => {
           return form 
         }),
         catchError((err: any) => {
           return throwError(err);
         })
       );
    }




    //? Funcion para eliminar un formulario
    deleteForm(id:number): Observable<Form>{
      const url = `${this.baseUrl}/forms/${id}`;
      
       return this.http.delete<Form>(url)
       .pipe(
         map((form: Form) => {
           return form 
         }),
         catchError((err: any) => {
           return throwError(err);
         })
       );
    }
}
