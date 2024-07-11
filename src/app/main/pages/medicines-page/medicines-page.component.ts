import { Component, inject, OnInit } from '@angular/core';
import { ConfirmationService, Message, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { MedicineService } from '../../services/meds/medicines.service';
import { Medicine } from '../../interfaces/Medicines/medicines.interface';
import Swal from 'sweetalert2';
import { CreateMedicComponent } from '../../components/medic/create-medic/create-medic.component';
import { ViewMedicComponent } from '../../components/medic/view-medic/view-medic.component';
import { CategoryService } from '../../services/meds/categories.service';
import { Category } from '../../interfaces/categories/category.interface';
import { ViewMedicineComponent } from '../../components/medicines/view-medicine/view-medicine.component';
import { CreateMedicineComponent } from '../../components/medicines/create-medicine/create-medicine.component';
@Component({
  selector: 'main-medicines-page',
  templateUrl: './medicines-page.component.html',
  styleUrl: './medicines-page.component.css',
  providers: [DialogService],
})
export class MedicinesPageComponent implements OnInit {
  //? Variables e Inyecciones
  private medicineService = inject(MedicineService);
  private dialogService = inject(DialogService);
  private categoryService = inject(CategoryService);

  public medicines: Medicine[] = [];
  idMedicine: number | undefined;
  existCategories: boolean = false;
  public totalCategories: number = 0;
  messages!: Message[];

  public totalMedicines: number = 0;
  public currentPage: number = 1;
  public pageSize: number = 10;
  public search: string = '';

  ngOnInit(): void {
    Swal.fire({
      title: 'Cargando medicamentos',
      html: 'Por favor espere un momento',
      timer: 2500,
      timerProgressBar: true,
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading()
        this.getAllCategories();
        this.countCategories();
        if(this.totalCategories === 0){
          this.messages = [{ severity: 'info', detail: 'No se pueden crear medicamentos debido a que no existen categorías.' }];
        }
        this.loadMedicines();
      }
    }).then((result) => {
      if(result.dismiss === Swal.DismissReason.timer){
      }
    })

  }

  //? Método para obtener todas las categorías
  getAllCategories() {
    this.categoryService.getAllCategories().subscribe({
      next: (categories: Category[]) => {
        if (categories.length > 0) {
          this.existCategories = true;
        }
      },
      error: (erResponse: any) => {
        this.existCategories = false;
      },
    });
  }

  //? Método para obtener la cantidad de categorias de medicinas registradas
  countCategories(){
    this.categoryService.getCategoriesCount()
    .subscribe({
      next: (count: number) => {
        this.totalCategories = count;
      },
      error: (erResponse: any) => {
        console.error(erResponse)
      }
    })
  }

  //? Método para obtener medicinas paginadas
  loadMedicines() {
    this.medicineService
      .getAllMedicinesPaginated(this.currentPage, this.pageSize, this.search)
      .subscribe({
        next: (resp: any) => {
          this.medicines = resp.data;
          this.totalMedicines = resp.total;
        },
      });
  }


  onPageChange(page: number){
    this.currentPage = page
    this.loadMedicines()
  }


  //? Metodo para buscar categorias
  onSearchChange(search: string){
    this.search = search
    this.currentPage = 1
    this.loadMedicines()
  }

  //? Método para eliminar una medicina
  deleteMedicine(id: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¡No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: '¡Sí, bórralo!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.medicineService.deleteMedicine(id).subscribe({
          next: (response: any) => {
            Swal.fire(
              '¡Eliminado!',
              'La medicina ha sido eliminada.',
              'success'
            );
            this.ngOnInit();
          },
          error: (erResponse: any) => {
            Swal.fire(
              'Error',
              'Hubo un error al eliminar la medicina',
              'error'
            );
          },
        });
      }
    });
  }

  //? Método para abrir el modal de agregar o ver medicina
  showModal(componentName: string, headerText: string) {
    if (componentName === 'create') {
      this.dialogService.open(CreateMedicineComponent, {
        header: headerText,
        breakpoints: { '960px': '500px', '640px': '100vw' },
        style: { 'max-width': '100vw', width: '50vw' },
        height: '70%',
        baseZIndex: 10000,
      });
    }

    if (componentName === 'view') {
      this.dialogService.open(ViewMedicineComponent, {
        header: headerText,
        breakpoints: { '960px': '500px', '640px': '100vw' },
        style: { 'max-width': '100vw', width: '50vw' },
        height: '70%',
        baseZIndex: 10000,
        data: {
          idMedicine: this.idMedicine,
        },
      });
    }
  }

  getMedicineId(id: number) {
    this.idMedicine = id;
  }

  ngOnDestroy(): void {}
}
