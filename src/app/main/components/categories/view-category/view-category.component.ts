import { Component, inject, OnInit } from '@angular/core';
import { CategoryService } from '../../../services/meds/categories.service';
import { CategoriesPageComponent } from '../../../pages/categories-page/categories-page.component';
import { ConfirmationService, MessageService } from 'primeng/api';
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { FormBuilder, Validators } from '@angular/forms';
import { Category } from '../../../interfaces/categories/category.interface';

@Component({
  selector: 'main-view-category',
  templateUrl: './view-category.component.html',
  styleUrl: './view-category.component.css',
  providers: [ConfirmationService, MessageService, DialogService],
})
export class ViewCategoryComponent implements OnInit {
  //? Variables e Inyecciones
  private categoryService = inject(CategoryService);
  private cetegoryPage = inject(CategoriesPageComponent);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);
  private ref: DynamicDialogRef = inject(DynamicDialogRef);
  private dynamicDialogConfig = inject(DynamicDialogConfig);
  private fb = inject(FormBuilder);

  idCategory: number = 0;
  categoryData: Category | undefined;

  categoryForm = this.fb.group({
    name_category: ['', [Validators.required]],
  });

  defaultCategoryForm = this.fb.group({
    name_category: [''],
  });

  ngOnInit(): void {
    this.idCategory = this.dynamicDialogConfig.data.idCategory;
    this.getCategoryData();
  }

  //? Método para obtener la data de la Categoria y mostrarla en el formulario
  getCategoryData() {
    this.categoryService.getCategoryById(this.idCategory).subscribe({
      next: (resp: Category) => {
        this.categoryData = resp;
        this.categoryForm.patchValue({
          name_category: this.categoryData.name_category,
        });
        this.defaultCategoryForm.patchValue({
          name_category: this.categoryData.name_category,
        });
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al obtener la información de la categoría',
        });
        setTimeout(() => {
          this.closeModal();
        }, 1500);
      },
    });
  }

  //? Método para actualizar la categoría
  updateCategory() {
    const categoryData = this.categoryForm.value;

    this.confirmationService.confirm({
      message:
        'Está seguro que desea actualizar esta Categoría de Medicamento?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: 'none',
      rejectIcon: 'none',
      acceptLabel: 'Si',
      rejectLabel: 'No',
      acceptButtonStyleClass: 'text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center disabled:bg-blue-400 pointer-events-auto',
      rejectButtonStyleClass: 'text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center  disabled:bg-red-400 pointer-events-auto mr-2', 
      accept: () => {
        this.categoryService
          .updateCategory(this.idCategory, categoryData)
          .subscribe({
            next: (resp: any) => {
              this.messageService.add({
                severity: 'success',
                summary: 'Éxito',
                detail: 'Categoría actualizada correctamente',
              });

              this.cetegoryPage.ngOnInit();
              setTimeout(() => {
                this.categoryForm = this.defaultCategoryForm;
                this.closeModal();
              }, 1200);
            },
            error: (err) => {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: err.error.message || 'Error al crear la categoría',
              });
            },
          });
      },
      reject: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Info',
          detail: 'Actualización cancelada',
        });
      },
    });
  }

  //? Método para cancelar la actualización de la categoría
  cancelUpdate() {
    this.confirmationService.confirm({
      message:
        'Está seguro que desea cancelar la actualización de la Categoría de Medicamento?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: 'none',
      rejectIcon: 'none',
      acceptLabel: 'Si',
      rejectLabel: 'No',
      acceptButtonStyleClass: 'text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center disabled:bg-blue-400 pointer-events-auto',
      rejectButtonStyleClass: 'text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center  disabled:bg-red-400 pointer-events-auto mr-2', 
      accept: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Actualización cancelada',
        });
        setTimeout(() => {
          this.categoryForm = this.defaultCategoryForm;
          this.closeModal();
        }, 1200);
      },
      reject: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Info',
          detail: 'Actualización no cancelada',
        });
      },
    });
  }

  //? Método para cerrar el modal
  closeModal() {
    this.ref.close();
  }

  ngOnDestroy(): void {}
}
