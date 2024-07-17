import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { PrimengModule } from '../primeng/primeng.module';
import { HttpClientModule } from '@angular/common/http';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { RestorePasswordPageComponent } from './pages/restore-password-page/restore-password-page.component';



@NgModule({
  declarations: [
    LoginPageComponent,
    AuthLayoutComponent,
    HomePageComponent,
    RestorePasswordPageComponent,
    
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
