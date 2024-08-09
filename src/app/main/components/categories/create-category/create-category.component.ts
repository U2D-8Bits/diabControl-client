import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { CategoryService } from '../../../services/meds/categories.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { CategoriesPageComponent } from '../../../pages/categories-page/categories-page.component';

@Component({
  selector: 'main-create-category',
  templateUrl: './create-category.component.html',
  styleUrl: './create-category.component.css',
  providers: [ConfirmationService, MessageService, DialogService],
})
export class CreateCategoryComponent implements OnInit {
  //? Variables e Inyecciones
  private categoryService = inject(CategoryService);
  private confirmationService = inject(ConfirmationService);
  private categoryPage = inject(CategoriesPageComponent);
  private messageService = inject(MessageService);
  private ref: DynamicDialogRef = inject(DynamicDialogRef);
  private dynamicDialogConfig = inject(DynamicDialogConfig);
  private fb = inject(FormBuilder);

  defaultForm = this.fb.group({
    name_category: ['', [Validators.required]],
  });

  categoryForm = this.fb.group({
    name_category: ['', [Validators.required]],
  });

  ngOnInit() {
  }

  //? Metodo para crear una categoria
  createCategory() {
    const categoryData = this.categoryForm.value;

    this.confirmationService.confirm({
      message: 'Está seguro que desea crear esta Categoría de Medicamento?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: 'none',
      rejectIcon: 'none',
      acceptLabel: 'Si',
      rejectLabel: 'No',
      acceptButtonStyleClass: 'text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center disabled:bg-blue-400 pointer-events-auto',
      rejectButtonStyleClass: 'text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center  disabled:bg-red-400 pointer-events-auto mr-2', 
      accept: () => {
        this.categoryService.createCategory(categoryData).subscribe({
          next: (resp: any) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: 'Categoría creada correctamente',
            });

            this.categoryPage.ngOnInit();
            setTimeout(() => {
              this.categoryForm = this.defaultForm;
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
          summary: 'Rechazado',
          detail: 'Se cancelo la creación de la categoría',
        });
      },
    });
  }

  cancelCategory() {
    this.confirmationService.confirm({
      message: 'Está seguro que desea cancelar la creación de esta Categoría de Medicamento?',
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
          detail: 'Se canceló la creación de la categoría'
        })
      },
      reject: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Rechazado',
          detail: 'No se canceló la creación de la categoría'
        })
      }
    });
  }

  closeModal() {
    this.ref.close();
  }

  ngOnDestroy() {
  }
}
