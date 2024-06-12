import { Component, inject, OnInit } from '@angular/core';
import { CategoryService } from '../../../services/categories.service';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'main-create-category',
  templateUrl: './create-category.component.html',
  styleUrl: './create-category.component.css'
})
export class CreateCategoryComponent implements OnInit{

  //? Variables e Inyecciones
  private categoryService = inject( CategoryService )
  private fb = inject( FormBuilder )

  categoryForm = this.fb.group({
    name_category: ['', [Validators.required] ],
  })

  ngOnInit(){
    console.log(`CreateCategoryComponent initialized!`)
    
  }

  //? Metodo para crear una categoria
  createCategory(){
    const categoryData = this.categoryForm.value
  }

  ngOnDestroy(){
    console.log(`CreateCategoryComponent destroyed!`)
  }

}
