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


  //? Variables e Inyecciones
  private categoryService = inject( CategoryService );
  public dialigService = inject( DialogService )
  ref: DynamicDialogRef | undefined;
  public categories: Category[] = [];
  public idCategory!: number;

  ngOnInit(): void {
    this.getCategories();
  }


  //? Metodo para obtener todas las categorias existentes
  getCategories(){
    this.categoryService.getAllCategories()
    .subscribe({
      next: (categories: Category[]) => {
        this.categories = categories;
      },
      error: (err: any ) => {
        console.log("Error:", err.error.message)
      }
    })
  }


  //? Metodo para obtener el id de una categoria
  getIdCategory(id: number){
    this.idCategory = id;
  }



  //? Metodo para abrir el modal
  showModal(componentName: string, headerText: string){
    if(componentName === 'create'){
      this.dialigService.open(CreateCategoryComponent, {
        header: headerText,
        maximizable: true,
        breakpoints: { '960px': '500px', '640px': '100vw' },
        style: { 'max-width': '100vw', width: '80vw' },
        height: '80%',
        contentStyle: { overflow: 'auto' },
        data: {

        }
      })
    }

    if(componentName === 'view'){
      this.dialigService.open(ViewCategoryComponent, {
        header: headerText,
        maximizable: true,
        breakpoints: { '960px': '500px', '640px': '100vw' },
        style: { 'max-width': '100vw', width: '80vw' },
        height: '80%',
        contentStyle: { overflow: 'auto' },
        data: {
          idCategory: this.idCategory,
        }
      })
    }
  }


  //? Metodo para eliminar una categoria
  deleteCategory(id: number){

    Swal.fire({
      title: '¿Estas seguro?',
      text: "No podras revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, borrar!',
      cancelButtonText: 'Cancelar'
    }).then((result) =>{
      if(result.isConfirmed){
        this.categoryService.deleteCategory(id)
        .subscribe({
          next: (category: Category) => {
            Swal.fire(
              'Borrado!',
              'La historia clinica ha sido eliminada.',
              'success'
            )
            this.getCategories()
          },
          error: (err: any) => {
            Swal.fire(
              'Error!',
              'Ha ocurrido un error al eliminar la historia clinica.',
              'error'
            )
          }
        })
      }
    })

  }


  ngOnDestroy(): void {
    
  }

}
