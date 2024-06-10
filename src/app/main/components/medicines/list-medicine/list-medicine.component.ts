import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'main-list-medicine',
  templateUrl: './list-medicine.component.html',
  styleUrl: './list-medicine.component.css',
})
export class ListMedicineComponent implements OnInit {




  ngOnInit(): void {
    console.log(`ListMedicineComponent initialized!`)
  }


  ngOnDestroy(): void {
    console.log(`ListMedicineComponent destroyed!`)
  }
}
