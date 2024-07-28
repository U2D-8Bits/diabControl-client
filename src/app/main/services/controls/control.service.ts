import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environments';
import { catchError, map, Observable, throwError } from 'rxjs';
import { Control } from '../../interfaces/controls/control.interface';
import { CreateControl } from '../../interfaces/controls/control-create.interface';
import { UpdateControl } from '../../interfaces/controls/control-update.interface';

@Injectable({providedIn: 'root'})
export class ControlService {

    constructor() { }
    
    private httpClient = inject(HttpClient);
    private readonly baseUrl: string = environment.baseUrl;


    //? Método para obtener los controles de un paciente por su id, con paginación

    getControlsByPatientId(id: number, page: number, limit: number): Observable<any>{

        const url = `${this.baseUrl}/control/paginated/${id}`;

        let params = new HttpParams()
        .set('page', page)
        .set('limit', limit);


        return this.httpClient.get<any>(url, {params})
        .pipe(
            map((resp: any) => {
                return resp;
            }),
            catchError((err: any) => {
                return err;
            }
        ));
    }


    //? Metodo para obtener un control por su id
    getControlById(id: number): Observable<Control>{
        const url = `${this.baseUrl}/control/${id}`;
    
        return this.httpClient.get<Control>(url)
        .pipe(
            map((control: Control) => {
                return control;
            }),
            catchError((err: any) => {
                return err;
            })
        ) as Observable<Control>;
    }


    //? Método para obtener los signos vitales de las historias de un paciente
    getPatientSignals(patientId: number): Observable<any>{
        const url = `${this.baseUrl}/control/reports/${patientId}`;

        return this.httpClient.get<any>(url)
        .pipe(
            map((resp: any) => {
                return resp;
            }),
            catchError((err: any) => {
                return err;
            }
        ));
    }



    //? Método para crear un control
    createControl(controlDto: CreateControl): Observable<Control>{
        const url = `${this.baseUrl}/control`;

        return this.httpClient.post<Control>(url, controlDto)
        .pipe(
            map((control: Control) => {
                return control;
            }),
            catchError((err: any) => {
                return err;
            })
        ) as Observable<Control>;
    }


    //? Método para actualizar un control
    updateControl(id: number, controlUpdateDto: UpdateControl, ): Observable<Control>{
        const url = `${this.baseUrl}/control/${id}`;

        return this.httpClient.patch<Control>(url, controlUpdateDto)
        .pipe(
            map((control: Control) => {
                return control;
            }),
            catchError((err: any) => {
                return err;
            })
        ) as Observable<Control>;
    }


    //? Método para eliminar un control
    deleteControl(id: number): Observable<Control>{
        const url = `${this.baseUrl}/control/${id}`;

        return this.httpClient.delete<Control>(url)
        .pipe(
            map((control: Control) => {
                return control;
            }),
            catchError((err: any) => {
                return err;
            })
        ) as Observable<Control>;
    }

    //Método para verificar si una historia clinica tiene asociado un control
    checkControlExistence(historyId: number): Observable<boolean>{
        const url = `${this.baseUrl}/control/asociated/${historyId}`;

        return this.httpClient.get<boolean>(url)
        .pipe(
            map((resp: any) => {
                return resp
              }),
              catchError((err: any) => {
                return throwError(err);
              })
        )
    }


}