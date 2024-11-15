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
    idCategory: [null, [Validators.required]],
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
      const medicineData = this.medicineForm.value as unknown as CreateMedicine;

      // Asegúrate de que idCategory sea un número
      medicineData.idCategory = Number(medicineData.idCategory);

      this.confirmationService.confirm({
        message: '¿Está seguro que desea crear este Medicamento?',
        header: 'Confirmation',
        icon: 'pi pi-exclamation-triangle',
        acceptIcon: 'none',
        rejectIcon: 'none',
        acceptLabel: 'Si',
        rejectLabel: 'No',
        acceptButtonStyleClass: 'text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center disabled:bg-blue-400 pointer-events-auto',
        rejectButtonStyleClass: 'text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center  disabled:bg-red-400 pointer-events-auto mr-2', 
        accept: () => {
          this.medicineService.createMedicine(medicineData).subscribe({
            next: (resp: any) => {
              this.messageService.add({
                severity: 'success',
                summary: 'Éxito',
                detail: 'Medicamento creado correctamente',
              });

              this.medicinePage.ngOnInit();
              setTimeout(() => {
                this.medicineForm.reset();
                this.closeModal();
              }, 1500);
            },
            error: (erResponse: any) => {

              if(erResponse.error.message === 'Ya existe un medicamento asociado a ese nombre genérico'){
                this.medicineForm.get('generic_name')?.reset();
              }

              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: erResponse.error.message || 'Error al crear el Medicamento',
              });
            },
          });
        },
        reject: () => {
          this.messageService.add({
            severity: 'info',
            summary: 'Cancelado',
            detail: 'Se canceló la creación del Medicamento',
          });
        },
      });
    }
  }


  cancelMedicine(): void {
    this.confirmationService.confirm({
      message: 'Está seguro que desea cancelar la creación de este Medicamento?',
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
          severity: 'info',
          summary: 'Cancelado',
          detail: 'Se cancelo la creación del Medicamento',
        });

        this.closeModal();
      },
      reject: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Se continuará con la creación del Medicamento',
        });
      }
    });
  }

  closeModal(): void{
    this.ref.close();
  }

  ngOnDestroy(): void {}
}
