import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Page404Component } from './pages/page404/page404.component';
import { RouterModule } from '@angular/router';
import { LoadingScreenComponent } from './components/loading-screen/loading-screen.component';



@NgModule({
  declarations: [
    Page404Component,
    LoadingScreenComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports:[
    Page404Component,
    LoadingScreenComponent
  ]
})
export class SharedModule { }
