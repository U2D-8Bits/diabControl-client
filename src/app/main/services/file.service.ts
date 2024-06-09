import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environments';
import { catchError, map, Observable, throwError } from 'rxjs';

@Injectable({providedIn: 'root'})
export class FileService {
    
    private httpClient = inject(HttpClient);
    private readonly baseUrl: string = environment.baseUrl;

    constructor(){}
    
    //? Metodo para subir un archivo
    uploadFile(userId: number, file: File): Observable<any>{

        const url = `${this.baseUrl}/file/upload/${userId}`;

        const formData: FormData = new FormData();
        formData.append('file', file, file.name)
        return this.httpClient.post(url, formData);
    }



    //? Metodo para obtener los archivos de un usuario
    getFile(userId: number): Observable<any>{
        const url = `${this.baseUrl}/file/uploaded/${userId}`;
        return this.httpClient.get(url);
    }



    //? Metodo para eliminar un archivo
    deleteFile(id: number): Observable<any>{
        const url = `${this.baseUrl}/file/${id}`;

        return this.httpClient.delete<any>(url)
                .pipe(
                    map((resp: any) => {
                        return resp;
                    }),
                    catchError((err: any) => {
                        return throwError(err);
                    })
                );
    }

}