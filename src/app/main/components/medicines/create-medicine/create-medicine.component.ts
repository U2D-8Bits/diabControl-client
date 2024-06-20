import { Component, inject, OnInit } from '@angular/core';
import { MedicineService } from '../../../services/meds/medicines.service';
import { CategoryService } from '../../../services/meds/categories.service';
import { FormBuilder, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Category } from '../../../interfaces/categories/category.interface';

@Component({
  selector: 'main-create-medicine',
  templateUrl: './create-medicine.component.html',
  styleUrl: './create-medicine.component.css',
  providers: [MessageService, ConfirmationService],
})
export class CreateMedicineComponent implements OnInit {

  //Variables e Inyecciones
  private medicineService = inject(MedicineService);
  private categoryService = inject(CategoryService);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);
  private fb = inject(FormBuilder);

  categories: Category[] = [];

  medicineForm = this.fb.group({
    name_medicine: ['', [Validators.required]],
    generic_name: ['', [Validators.required]],
    idCategory: [0, [Validators.required]],
  });

  ngOnInit(): void {}


  //Método para obtener todas las categorías
  getAllCategories(): void{
    this.categoryService
    .getAllCategories()
    .subscribe({
      next: (categories: Category[]) => {
        this.categories = categories;
      }
    })
  }
  //Método para crear una medicina

  ngOnDestroy(): void {}
}
