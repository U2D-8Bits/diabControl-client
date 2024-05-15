import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { PrimengModule } from '../primeng/primeng.module';
import { HttpClientModule } from '@angular/common/http';



@NgModule({
  declarations: [
    LoginPageComponent,
    AuthLayoutComponent,
    
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    RouterModule,

    ReactiveFormsModule,
    HttpClientModule,

    PrimengModule
  ],
  exports: [
    AuthLayoutComponent,
    LoginPageComponent
  ]
})
export class AuthModule { }
