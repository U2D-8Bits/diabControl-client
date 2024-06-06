import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environments';
import { catchError, map, Observable, throwError } from 'rxjs';
import { History } from '../interfaces/history.interface';

@Injectable({providedIn: 'root'})
export class HistoryService {
    constructor() { }

    //? Variables e Inyecciones
    private httpClient = inject(HttpClient);
    private readonly baseUrl: string = environment.baseUrl;
    


    //? Metodo para obtener todos las historias medicas
    getAllHistories(): Observable<History[]>{
        const url = `${this.baseUrl}/histories`;

        return this.httpClient.get<History[]>(url)
        .pipe(
            map((histories: History[]) => {
                return histories;
            }),
            catchError((err: any) => {
                return throwError(err);
            })
        );
    }


    //? Metodo para obtener todas las historias medicas de un paciente por su id
    getHistoriesByPatientId(id: number): Observable<History[]>{
        const url = `${this.baseUrl}/histories/paciente/${id}`;

        return this.httpClient.get<History[]>(url)
        .pipe(
            map((histories: History[]) => {
                return histories;
            }),
            catchError((err: any) => {
                return throwError(err);
            })
        );
    }



    //? Metodo para obtener una historia medica por id
    getHistoryById(id: number): Observable<History>{
        const url = `${this.baseUrl}/histories/${id}`;

        return this.httpClient.get<History>(url)
        .pipe(
            map((history: History) => {
                return history;
            }),
            catchError((err: any) => {
                return throwError(err);
            })
        );
    }



    //? Metodo para crear una historia medica
    crateHistory(history: any): Observable<History>{
        const url = `${this.baseUrl}/histories`;

        return this.httpClient.post<History>(url, history)
        .pipe(
            map((history: History) => {
                return history;
            }),
            catchError((err: any) => {
                return throwError(err);
            })
        );
    }


    //? Metodo para actualizar una historia medica
    updateHistory(id: number, history: any): Observable<History>{
        const url = `${this.baseUrl}/histories/${id}`;

        return this.httpClient.patch<History>(url, history)
        .pipe(
            map((history: History) => {
                return history;
            }),
            catchError((err: any) => {
                return throwError(err);
            })
        );
    }


    //? Metodo para eliminar una historia medica
    deleteHistory(id: number): Observable<History>{
        const url = `${this.baseUrl}/histories/${id}`;

        return this.httpClient.delete<History>(url)
        .pipe(
            map((history: History) => {
                return history;
            }),
            catchError((err: any) => {
                return throwError(err);
            })
        );
    }

}