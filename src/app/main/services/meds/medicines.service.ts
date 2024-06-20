import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environments';
import { catchError, map, Observable, of } from 'rxjs';
import { Medicine } from '../../interfaces/Medicines/medicines.interface';
import { CreateMedicine } from '../../interfaces/Medicines/create-medicine.interface';

@Injectable({providedIn: 'root'})
export class MedicineService {
    
    private http = inject(HttpClient);
    private baseUrl: string = environment.baseUrl;


    getAllMedicines(): Observable<Medicine[]>{
        const url = `${this.baseUrl}/medicines`;

        return this.http.get<Medicine[]>(url)
        .pipe(
            map((medicines: Medicine[]) => medicines),
            catchError((err: any) => {
                return of(err)
            })
        )
    }

    getMedicineById(id: number): Observable<Medicine>{
        const url = `${this.baseUrl}/medicines/${id}`;

        return this.http.get<Medicine>(url)
        .pipe(
            map((medicine: Medicine) => medicine),
            catchError((err: any) => {
                return of(err)
            })
        )
    }

    createMedicine(medicine: CreateMedicine): Observable<Medicine>{
        const url = `${this.baseUrl}/medicines`;

        return this.http.post<Medicine>(url, medicine)
        .pipe(
            map((medicine: Medicine) => medicine),
            catchError((err: any) => {
                return of(err)
            })
        )
    }

    updateMedicine(id: number, medicine: CreateMedicine): Observable<Medicine>{
        const url = `${this.baseUrl}/medicines/${id}`;

        return this.http.put<Medicine>(url, medicine)
        .pipe(
            map((medicine: Medicine) => medicine),
            catchError((err: any) => {
                return of(err)
            })
        )
    }

    deleteMedicine(id: number): Observable<Medicine>{
        const url = `${this.baseUrl}/medicines/${id}`;

        return this.http.delete<Medicine>(url)
        .pipe(
            map((medicine: Medicine) => medicine),
            catchError((err: any) => {
                return of(err)
            })
        )
    }
    
}