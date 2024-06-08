import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environments';
import { catchError, map, Observable, throwError } from 'rxjs';
import { ActInterface } from '../interfaces/acts/act.interface';
import { ActCreateInterface } from '../interfaces/acts/act-create.interface';

@Injectable({providedIn: 'root'})
export class ActService {
    constructor() { }
    
        //? Variables e Inyecciones
        private httpClient = inject(HttpClient);
        private readonly baseUrl: string = environment.baseUrl;


        //? Metodo para crear un acta
        createAct(actData: any): Observable<ActInterface>{

            const url = `${this.baseUrl}/act`;

            return this.httpClient.post<ActInterface>(url, actData)
            .pipe(
                map((act: ActInterface) => {
                    return act;
                }),
                catchError((err: any) => {
                    return throwError(err);
                })
            )
        }


        //? Metodo para obtener todas las actas
        getAllActs(): Observable<ActInterface[]>{

            const url = `${this.baseUrl}/act`;

            return this.httpClient.get<ActInterface[]>(url)
            .pipe(
                map((acts: ActInterface[]) => {
                    return acts;
                }),
                catchError((err: any) => {
                    return throwError(err);
                })
            )
        }


        //? Metodo para obtener un acta por su id
        getActById(id: number): Observable<ActInterface>{
            const url = `${this.baseUrl}/act/${id}`;

            return this.httpClient.get<ActInterface>(url)
            .pipe(
                map((act: ActInterface) => {
                    return act;
                }),
                catchError((err: any) => {
                    return throwError(err);
                })
            )
        }


        //? Metodo para obtener todas las actas de un paciente por su id
        getActByPatientId(id: number): Observable<ActInterface>{

            const url = `${this.baseUrl}/act/patient/${id}`;

            return this.httpClient.get<ActInterface>(url)
            .pipe(
                map((act: ActInterface) => {
                    return act;
                }),
                catchError((err: any) => {
                    return throwError(err);
                })
            )
        }


        //? Metodo para actualizar un acta
        updateAct(id: number, actData: ActCreateInterface): Observable<ActInterface>{

            const url = `${this.baseUrl}/act/${id}`;

            return this.httpClient.patch<ActInterface>(url, actData)
            .pipe(
                map((act: ActInterface) => {
                    return act;
                }),
                catchError((err: any) => {
                    return throwError(err);
                })
            )
        }


        //? Metodo para eliminar un acta
        deleteAct(id: number): Observable<ActInterface>{

            const url = `${this.baseUrl}/act/${id}`;

            return this.httpClient.delete<ActInterface>(url)
            .pipe(
                map((act: ActInterface) => {
                    return act;
                }),
                catchError((err: any) => {
                    return throwError(err);
                })
            )
        }

}