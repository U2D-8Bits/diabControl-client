import { Component, inject, OnInit } from '@angular/core';
import { MedicineService } from '../../../services/meds/medicines.service';
import { CategoryService } from '../../../services/meds/categories.service';
import { FormBuilder, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Category } from '../../../interfaces/categories/category.interface';
import { CreateMedicine } from '../../../interfaces/Medicines/create-medicine.interface';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { MedicinesPageComponent } from '../../../pages/medicines-page/medicines-page.component';

@Component({
  selector: 'main-create-medicine',
  templateUrl: './create-medicine.component.html',
  styleUrl: './create-medicine.component.css',
  providers: [MessageService, ConfirmationService],
})
export class CreateMedicineComponent implements OnInit {
  //Variables e Inyecciones
  private medicinePage = inject(MedicinesPageComponent)
  private medicineService = inject(MedicineService);
  private categoryService = inject(CategoryService);
  private messageService = inject(MessageService);
  private ref: DynamicDialogRef = inject(DynamicDialogRef);
  private confirmationService = inject(ConfirmationService);
  private fb = inject(FormBuilder);

  categories: Category[] = [];

  medicineForm = this.fb.group({
    name_medicine: ['', [Validators.required]],
    generic_name: ['', [Validators.required]],
    idCategory: [0, [Validators.required]],
  });

  ngOnInit(): void {
    this.getAllCategories();
  }

  //Método para obtener todas las categorías
  getAllCategories(): void {
    this.categoryService.getAllCategories().subscribe({
      next: (categories: Category[]) => {
        this.categories = categories;
      },
    });
  }

  //? Método para crear una medicina
  createMedicine() {
    if (this.medicineForm.valid) {

      const medicineData = this.medicineForm.value as CreateMedicine;
      medicineData.idCategory = Number(medicineData.idCategory);

      
      this.confirmationService.confirm({
        message: 'Está seguro que desea crear esta Categoría de Medicamento?',
        header: 'Confirmation',
        icon: 'pi pi-exclamation-triangle',
        acceptIcon: 'none',
        rejectIcon: 'none',
        rejectButtonStyleClass:
          'p-button-danger, padding: 10px; borer-radius: 5px; border: 1px solid red;',
        acceptButtonStyleClass: 'p-button-success',
        accept: () => {
          this.medicineService
          .createMedicine(medicineData)
          .subscribe({
            next: (resp: any) => {
              console.log(resp);
              this.messageService.add({
                severity: 'success',
                summary: 'Éxito',
                detail: 'Medicina creada correctamente',
              });

              this.medicinePage.ngOnInit();
              setTimeout(() => {
                this.medicineForm.reset();
                this.closeModal();
              }, 1500)
              
            },
            error: (erResponse: any) => {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: erResponse.error.message || 'Error al crear la medicina',
              });
            }
          })
        },
        reject: () => {
          this.messageService.add({
            severity: 'info',
            summary: 'Rechazado',
            detail: 'Se cancelo la creación de la medicina',
          });
        }
      });
    }
  }


  cancelMedicine(): void {
    this.confirmationService.confirm({
      message: 'Está seguro que desea cancelar la creación de esta medicina?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: 'none',
      rejectIcon: 'none',
      rejectButtonStyleClass:
        'p-button-danger, padding: 10px; borer-radius: 5px; border: 1px solid red;',
      acceptButtonStyleClass: 'p-button-success',
      accept: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Cancelado',
          detail: 'Se cancelo la creación de la medicina',
        });

        this.closeModal();
      },
      reject: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Se continuará con la creación de la medicina',
        });
      }
    });
  }

  closeModal(): void{
    this.ref.close();
  }

  ngOnDestroy(): void {}
}
