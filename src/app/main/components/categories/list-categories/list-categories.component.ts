import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'main-list-categories',
  templateUrl: './list-categories.component.html',
  styleUrl: './list-categories.component.css'
})
export class ListCategoriesComponent implements OnInit{

  //Variables e Inyecciones

  ngOnInit(): void {
    console.log(`ListCategoriesComponent initialized!`)
  }


  ngOnDestroy(): void {
    console.log(`ListCategoriesComponent destroyed!`)
  }

}
