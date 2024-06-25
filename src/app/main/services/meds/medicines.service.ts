import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environments';
import { catchError, map, Observable, of } from 'rxjs';
import { Medicine } from '../../interfaces/Medicines/medicines.interface';
import { CreateMedicine } from '../../interfaces/Medicines/create-medicine.interface';

@Injectable({ providedIn: 'root' })
export class MedicineService {
  private http = inject(HttpClient);
  private baseUrl: string = environment.baseUrl;

  //? Servicio para obtener todas las medicinas
  getAllMedicines(): Observable<Medicine[]> {
    const url = `${this.baseUrl}/medicines`;

    return this.http.get<Medicine[]>(url).pipe(
      map((medicines: Medicine[]) => medicines),
      catchError((err: any) => {
        return of(err);
      })
    );
  }


  //? Servicio para obtener la cantidad de medicinas registradas
  getMedicinesCount(): Observable<number> {
    const url = `${this.baseUrl}/medicines/count`;

    return this.http.get<number>(url).pipe(
      map((count: number) => count),
      catchError((err: any) => {
        return of(err);
      })
    );
  }


  //? Servicio para obtener todas las medicinas paginadas
  getAllMedicinesPaginated(
    page: number,
    limit: number,
    search: string
  ): Observable<any> {
    const url = `${this.baseUrl}/medicines/paginated`;

    let params = new HttpParams().set('page', page).set('limit', limit);
    if (search) {
      params = params.set('search', search);
    }

    return this.http.get<any>(url, { params }).pipe(
      map((resp: any) => {
        return resp;
      }),
      catchError((err: any) => {
        return of(err);
      })
    );
  }

  //? Servicio para obtener una medicina por su id
  getMedicineById(id: number): Observable<Medicine> {
    const url = `${this.baseUrl}/medicines/${id}`;

    return this.http.get<Medicine>(url).pipe(
      map((medicine: Medicine) => medicine),
      catchError((err: any) => {
        return of(err);
      })
    );
  }

  //? Servicio para crear una nueva medicina
  createMedicine(medicine: any): Observable<Medicine> {
    const url = `${this.baseUrl}/medicines`;

    return this.http.post<Medicine>(url, medicine).pipe(
      map((medicine: Medicine) => medicine),
      catchError((err: any) => {
        return of(err);
      })
    );
  }

  //? Servicio para actualizar una medicina
  updateMedicine(id: number, medicine: CreateMedicine): Observable<Medicine> {
    const url = `${this.baseUrl}/medicines/${id}`;

    return this.http.patch<Medicine>(url, medicine).pipe(
      map((medicine: Medicine) => medicine),
      catchError((err: any) => {
        return of(err);
      })
    );
  }

  //? Servicio para eliminar una medicina
  deleteMedicine(id: number): Observable<Medicine> {
    const url = `${this.baseUrl}/medicines/${id}`;

    return this.http.delete<Medicine>(url).pipe(
      map((medicine: Medicine) => medicine),
      catchError((err: any) => {
        return of(err);
      })
    );
  }
}
