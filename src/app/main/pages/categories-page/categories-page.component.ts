import { Component, inject, OnInit } from '@angular/core';
import { CategoryService } from '../../services/meds/categories.service';
import { Category } from '../../interfaces/categories/category.interface';
import Swal from 'sweetalert2';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CreateCategoryComponent } from '../../components/categories/create-category/create-category.component';
import { ViewCategoryComponent } from '../../components/categories/view-category/view-category.component';

@Component({
  selector: 'main-categories-page',
  templateUrl: './categories-page.component.html',
  styleUrl: './categories-page.component.css',
  providers: [ConfirmationService, MessageService, DialogService]
})
export class CategoriesPageComponent implements OnInit {

  // Variables e Inyecciones
  private categoryService = inject(CategoryService);
  public dialogService = inject(DialogService);
  ref: DynamicDialogRef | undefined;


  public categories: Category[] = [];
  public idCategory!: number;
  public totalCategories: number = 0
  public currentPage: number = 1
  public pageSize: number = 10
  public search: string = ''




  ngOnInit(): void {
    // this.getCategories();
    this.loadCategories()
  }

  //? Metodo para obtener todas las categorias existentes
  getCategories() {
    this.categoryService.getAllCategories().subscribe({
      next: (categories: Category[]) => {
        if (categories.length > 0) {
          this.categories = categories;
        }
      },
      error: (err: any) => {
        console.error('Error fetching categories:', err);
      }
    });
  }



  //? Método para cargar las categorias
  loadCategories(){
    this.categoryService.getAllCategoriesPaginated(this.currentPage, this.pageSize, this.search)
    .subscribe({
      next: (resp: any) => {
        this.categories = resp.data;
        this.totalCategories = resp.total;
      }
    })
  }


  onPageChange(page: number){
    this.currentPage = page
    this.loadCategories()
  }


  //? Metodo para buscar categorias
  onSearchChange(search: string){
    this.search = search
    this.currentPage = 1
    this.loadCategories()
  }



  //? Metodo para obtener el id de una categoria
  getIdCategory(id: number) {
    this.idCategory = id;
  }

  //? Metodo para abrir el modal
  showModal(componentName: string, headerText: string) {
    if (componentName === 'create') {
      this.dialogService.open(CreateCategoryComponent, {
        header: headerText,
        breakpoints: { '960px': '500px', '640px': '100vw' },
        style: { 'max-width': '100vw', width: '30vw' },
        height: '50%',
        contentStyle: { overflow: 'auto' },
      });
    }

    if (componentName === 'view') {
      this.dialogService.open(ViewCategoryComponent, {
        header: headerText,
        breakpoints: { '960px': '500px', '640px': '100vw' },
        style: { 'max-width': '100vw', width: '30vw' },
        height: '50%',
        contentStyle: { overflow: 'auto' },
        data: {
          idCategory: this.idCategory,
        }
      });
    }
  }

  //? Metodo para eliminar una categoria
  deleteCategory(id: number) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "¡No podrás revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, borrar!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.categoryService.deleteCategory(id).subscribe({
          next: (category: Category) => {
            Swal.fire(
              '¡Borrado!',
              'La categoría ha sido eliminada.',
              'success'
            );
            this.getCategories();
          },
          error: (err: any) => {
            Swal.fire(
              'Error!',
              'Ha ocurrido un error al eliminar la categoría. Verifique que la categoría no tenga medicamentos asociados.',
              'error'
            );
          }
        });
      }
    });
  }

  ngOnDestroy(): void {
    if (this.ref) {
      this.ref.close();
    }
  }
}
