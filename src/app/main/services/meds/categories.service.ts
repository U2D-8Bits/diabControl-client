import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { environment } from '../../../environments/environments';
import { Category } from '../../interfaces/categories/category.interface';

@Injectable({ providedIn: 'root' })
export class CategoryService {
    
  //? Variables e Inyecciones
  private readonly baseUrl: string = environment.baseUrl;
  private http = inject(HttpClient);


  //? Servicio para crear una nueva categoria
  createCategory(categoryData: any): Observable<Category> {

    const url = `${this.baseUrl}/categories`

    return this.http.post<Category>(url, categoryData)
    .pipe(
        map((category: Category) => {
            return category
        }),
        catchError((err: any) => {
            return of(err)
        })
    )
  }


  //? Servicio para obtener todas las categorias
  getAllCategories(): Observable<Category[]>{
    const url = `${this.baseUrl}/categories`;

    return this.http.get<Category[]>(url)
    .pipe(
        map((categories: Category[]) => {
            return categories
        }),
        catchError((err: any) => {
            return of(err)
        })
    )
  }


  //? Servicio para obtener una categoria por su id
  getCategoryById(id: number): Observable<Category>{
    const url = `${this.baseUrl}/categories/${id}`;

    return this.http.get<Category>(url)
    .pipe(
        map((category: Category) => {
            return category
        }),
        catchError((err: any) => {
            return of(err)
        })
    )
  }


  //? Servicio para actualizar una categoria
  updateCategory(id: number, categoryData: any): Observable<Category>{

    const url = `${this.baseUrl}/categories/${id}`;

    return this.http.patch<Category>(url, categoryData)
    .pipe(
        map((category: Category) => {
            return category
        }),
        catchError((err: any) => {
            return of(err)
        })
    )

  }


  //? Servicio para eliminar una categoria
  deleteCategory(id: number): Observable<Category>{

    const url = `${this.baseUrl}/categories/${id}`;

    return this.http.delete<Category>(url)
    .pipe(
        map((category: Category) => {
            return category
        }),
        catchError((err: any) => {
            return throwError(err)
        })
    )

  }

  
}
