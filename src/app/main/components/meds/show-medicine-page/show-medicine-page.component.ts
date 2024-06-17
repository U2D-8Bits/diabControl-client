import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-show-medicine-page',
  templateUrl: './show-medicine-page.component.html',
  styleUrl: './show-medicine-page.component.css'
})
export class ShowMedicinePageComponent implements OnInit{

  public selectedIndex = 0;

  onTabChange(event: any) {
    this.selectedIndex = event.index;
  }

  ngOnInit(): void {
    
  }


  ngOnDestroy(){

  }

}
