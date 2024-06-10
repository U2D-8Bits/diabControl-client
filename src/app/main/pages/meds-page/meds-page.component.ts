import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-meds-page',
  templateUrl: './meds-page.component.html',
  styleUrl: './meds-page.component.css'
})
export class MedsPageComponent implements OnInit {

  public selectedIndex = 0;

  onTabChange(event: any) {
    this.selectedIndex = event.index;
  }

  ngOnInit(): void {
    
  }


  ngOnDestroy(): void {
    
  }

}
