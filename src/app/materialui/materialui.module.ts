import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {MatIconModule} from '@angular/material/icon'; 
import {MatTabsModule} from '@angular/material/tabs'; 

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MatIconModule,
    MatTabsModule,
  ],
  exports:[
    MatIconModule,
    MatTabsModule,
  ]
})
export class MaterialuiModule { }
