import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MessageService, ConfirmationService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MedicinesPageComponent } from '../../../pages/medicines-page/medicines-page.component';
import { CategoryService } from '../../../services/meds/categories.service';
import { MedicineService } from '../../../services/meds/medicines.service';
import { Category } from '../../../interfaces/categories/category.interface';
import { Medicine } from '../../../interfaces/Medicines/medicines.interface';
import { CreateMedicine } from '../../../interfaces/Medicines/create-medicine.interface';

@Component({
  selector: 'main-view-medicine',
  templateUrl: './view-medicine.component.html',
  styleUrl: './view-medicine.component.css',
  providers: [MessageService, ConfirmationService],
})
export class ViewMedicineComponent implements OnInit {

  private medicinePage = inject(MedicinesPageComponent)
  private medicineService = inject(MedicineService);
  private categoryService = inject(CategoryService);
  private messageService = inject(MessageService);
  private ref: DynamicDialogRef = inject(DynamicDialogRef);
  private confirmationService = inject(ConfirmationService);
  private dynamicDialogConfig = inject(DynamicDialogConfig);
  private fb = inject(FormBuilder);

  idMedicine: number = 0;
  categories: Category[] = [];

  medicineForm = this.fb.group({
    name_medicine: ['', [Validators.required]],
    generic_name: ['', [Validators.required]],
    idCategory: [0, [Validators.required]],
  });

  defaultForm = this.fb.group({
    name_medicine: ['', [Validators.required]],
    generic_name: ['', [Validators.required]],
    idCategory: [0, [Validators.required]],
  })

  ngOnInit(){
    this.idMedicine = this.dynamicDialogConfig.data.idMedicine;
    this.initializeForm();
  }

  initializeForm() {
    this.getAllCategories().then(() => {
      this.getMedicineById();
    });
  }

  // Método para obtener todas las categorías
  async getAllCategories() {
    return new Promise<void>((resolve, reject) => {
      this.categoryService
        .getAllCategories()
        .subscribe({
          next: (categories: Category[]) => {
            this.categories = categories;
            resolve();
          },
          error: (erResponse: any) => {
            console.error('Error fetching categories:', erResponse);
            reject();
          }
        });
    });
  }

  // Método para obtener una medicina por su id
  getMedicineById() {
    this.medicineService
      .getMedicineById(this.idMedicine)
      .subscribe({
        next: (medicine: Medicine) => {
          this.medicineForm.patchValue({
            name_medicine: medicine.name_medicine,
            generic_name: medicine.generic_name,
            idCategory: medicine.category.id
          });

          this.defaultForm.patchValue({
            name_medicine: medicine.name_medicine,
            generic_name: medicine.generic_name,
            idCategory: medicine.category.id
          })
        },
        error: (erResponse: any) => {
          console.error('Error fetching medicine:', erResponse);
        }
      });
  }

  //? Método para actualizar una medicina
  updateMedicine(){
    const medicineData = this.medicineForm.value as CreateMedicine;

    this.confirmationService.confirm({
      message: 'Está seguro que desea modificar este Medicamento?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: 'none',
      rejectIcon: 'none',
      rejectButtonStyleClass:
        'p-button-danger, padding: 10px; borer-radius: 5px; border: 1px solid red;',
      acceptButtonStyleClass: 'p-button-success',
      accept: () => {
        this.medicineService
        .updateMedicine(this.idMedicine, medicineData)
        .subscribe({
          next: (resp: any) => {
           this.messageService.add({
             severity: 'success',
             summary: 'Éxito',
             detail: 'Medicamento actualizado correctamente'
           })

           this.medicinePage.ngOnInit();
           setTimeout(() => {
            this.closeModal();
           }, 1500)
        },
        error: (erResponse: any) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: erResponse.error.message
          })
        }
      })
      },
      reject: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Rechazado',
          detail: 'Se cancelo la actualización del Medicamento'
        })
        this.medicineForm.patchValue(this.defaultForm.value);
      }
    })
  }

  cancelUpdate(){
    this.confirmationService.confirm({
      message: 'Está seguro que desea cancelar la modificación de este Medicamento?',
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
          detail: 'Se cancelo la modificación del Medicamento'
        })
        this.medicineForm.patchValue(this.defaultForm.value);
        setTimeout(() => {
          this.closeModal();
        }, 1500)
      },
      reject: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Rechazado',
          detail: 'Se cancelo la cancelación de la modificación del Medicamento'
        })
      }
    })
  }


  closeModal(){
    this.ref.close();
  }

  ngOnDestroy() {
  }
}
