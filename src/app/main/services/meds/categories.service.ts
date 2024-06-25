import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
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
    const url = `${this.baseUrl}/categories`;

    return this.http.post<Category>(url, categoryData).pipe(
      map((category: Category) => {
        return category;
      }),
      catchError((err: any) => {
        return of(err);
      })
    );
  }

  //? Servicio para obtener todas las categorias
  getAllCategories(): Observable<Category[]> {
    const url = `${this.baseUrl}/categories`;

    return this.http.get<Category[]>(url).pipe(
      map((categories: Category[]) => {
        return categories;
      }),
      catchError((err: any) => {
        return of(err);
      })
    );
  }

  //? Servicio para obtener la cantidad de categoria de medicinas registradas
  getCategoriesCount(): Observable<number> {
    const url = `${this.baseUrl}/categories/count`;

    return this.http.get<number>(url).pipe(
      map((count: number) => count),
      catchError((err: any) => {
        return of(err);
      })
    );
  }

  //? Servicio para obtener todas las categorias paginadas
  getAllCategoriesPaginated(
    page: number,
    limit: number,
    search: string
  ): Observable<any> {
    const url = `${this.baseUrl}/categories/paginated`;

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

  //? Servicio para obtener una categoria por su id
  getCategoryById(id: number): Observable<Category> {
    const url = `${this.baseUrl}/categories/${id}`;

    return this.http.get<Category>(url).pipe(
      map((category: Category) => {
        return category;
      }),
      catchError((err: any) => {
        return of(err);
      })
    );
  }

  //? Servicio para actualizar una categoria
  updateCategory(id: number, categoryData: any): Observable<Category> {
    const url = `${this.baseUrl}/categories/${id}`;

    return this.http.patch<Category>(url, categoryData).pipe(
      map((category: Category) => {
        return category;
      }),
      catchError((err: any) => {
        return of(err);
      })
    );
  }

  //? Servicio para eliminar una categoria
  deleteCategory(id: number): Observable<Category> {
    const url = `${this.baseUrl}/categories/${id}`;

    return this.http.delete<Category>(url).pipe(
      map((category: Category) => {
        return category;
      }),
      catchError((err: any) => {
        return throwError(err);
      })
    );
  }
}
