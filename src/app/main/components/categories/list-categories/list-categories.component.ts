import { Component, inject, OnInit } from '@angular/core';
import { Category } from '../../../interfaces/categories/category.interface';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { CategoryService } from '../../../services/categories.service';
import { CreateCategoryComponent } from '../create-category/create-category.component';
import { ViewCategoryComponent } from '../view-category/view-category.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'main-list-categories',
  templateUrl: './list-categories.component.html',
  styleUrl: './list-categories.component.css',
  providers: [ConfirmationService, MessageService, DialogService]
})
export class ListCategoriesComponent implements OnInit{

  //? Variables e Inyecciones
  private confirmationService = inject( ConfirmationService)
  private messageService = inject( MessageService)
  public dialogService = inject( DialogService )
  private categoryService = inject( CategoryService )
  public categories: Category[] = [];

  ngOnInit(): void {
    console.log(`ListCategoriesComponent initialized!`)

    this.getAllCategories();
  }


  showDialog(componentName: string, headerText: string){

    if( componentName === 'create'){
      this.dialogService.open(CreateCategoryComponent,{
        header: headerText,
        breakpoints: { '960px': '500px', '640px': '100vw' },
        style: { 'max-width': '90vw', width: '80vw' },
        height: '80%',
        contentStyle: { overflow: 'auto' },
      })
    }

    if( componentName === 'view'){
      this.dialogService.open(ViewCategoryComponent, {
        header: headerText,
        breakpoints: { '960px': '500px', '640px': '100vw' },
        style: { 'max-width': '90vw', width: '80vw' },
        height: '80%',
        contentStyle: { overflow: 'auto' },
      })
    }

  }



  //? Metodo para obtener todas las categorias
  getAllCategories(){
    this.categoryService.getAllCategories()
    .subscribe({
      next: (categories) => {
        this.categories = categories
      },
      error: (error) => {
        console.error(error)
      }
    })
  }



  //? Metodo para eliminar una categoria
  deleteCategory(id: number){

    Swal.fire({
      title: '¿Estás seguro?',
      text: "¡No podrás revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: '¡Sí, bórralo!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.categoryService.deleteCategory(id)
        .subscribe({
          next: (resp) => {
            this.getAllCategories();
            Swal.fire(
              '¡Eliminado!',
              'La categoría ha sido eliminada.',
              'success'
            )
          },
          error: (error) => {
            console.error(error)
            Swal.fire(
              'Error!',
              'Ha ocurrido un error al intentar eliminar la categoría.',
              'error'
            )
          }
        })
      }
    })

  }

  ngOnDestroy(): void {
    console.log(`ListCategoriesComponent destroyed!`)
  }

}
