import { Component, inject, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { MedicineService } from '../../services/meds/medicines.service';
import { Medicine } from '../../interfaces/Medicines/medicines.interface';
import Swal from 'sweetalert2';
import { CreateMedicComponent } from '../../components/medic/create-medic/create-medic.component';
import { ViewMedicComponent } from '../../components/medic/view-medic/view-medic.component';
import { CategoryService } from '../../services/meds/categories.service';
import { Category } from '../../interfaces/categories/category.interface';
@Component({
  selector: 'main-medicines-page',
  templateUrl: './medicines-page.component.html',
  styleUrl: './medicines-page.component.css',
  providers: [DialogService]
})
export class MedicinesPageComponent implements OnInit{


  //? Variables e Inyecciones
  private medicineService = inject(MedicineService);
  private dialogService = inject(DialogService);
  private categoryService = inject(CategoryService);


  medicines: Medicine[] = [];
  idMedicine: number | undefined;
  existCategories: boolean = false;

  ngOnInit(): void {
    this.getAllMedicines();
  }


  //? Método para obtener todas las categorías
  getAllCategories(): void{
    this.categoryService
    .getAllCategories()
    .subscribe({
      next: (categories: Category[]) => {
        if(categories.length > 0){
          this.existCategories = true;
        }
      },
      error: (erResponse: any) => {
        this.existCategories = false; 
      }
    })
  }

  //? Método para obtener todas las medicinas
  getAllMedicines(): void {
    this.medicineService
    .getAllMedicines()
    .subscribe({
      next: (medicines: Medicine[]) => {
        this.getAllCategories();
        this.medicines = medicines;
      },
      error: (erResponse: any) => {
        
      }
    })
  }


  //? Método para eliminar una medicina
  deleteMedicine(id: number): void {
    
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
        this.medicineService
        .deleteMedicine(id)
        .subscribe({
          next: (response: any) => {
            this.getAllMedicines();
            Swal.fire(
              '¡Eliminado!',
              'La medicina ha sido eliminada.',
              'success'
            )
          },
          error: (erResponse: any) => {
            Swal.fire(
              'Error',
              'Hubo un error al eliminar la medicina',
              'error'
            )
          }
        })
      }
    })

  }


  //? Método para abrir el modal de agregar o ver medicina
  showModal(componentName: string, headerText: string){

    if(componentName === 'create'){
      this.dialogService.open( CreateMedicComponent, {
        header: headerText,
        breakpoints: { '960px': '500px', '640px': '100vw' },
        style: { 'max-width': '100vw', width: '50vw' },
        height: '50%',
        baseZIndex: 10000
      })
    }

    if(componentName === 'view'){
      this.dialogService.open( ViewMedicComponent, {
        header: headerText,
        breakpoints: { '960px': '500px', '640px': '100vw' },
        style: { 'max-width': '100vw', width: '50vw' },
        height: '50%',
        baseZIndex: 10000,
        data: {
          idMedicine: this.idMedicine
        }
      })
    }

  }

  getMedicineId(id: number){
    this.idMedicine = id;
  }


  ngOnDestroy(): void {

  }

}
