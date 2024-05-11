import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainRoutingModule } from './main-routing.module';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { HeroPageComponent } from './pages/hero-page/hero-page.component';
import { PatientsPageComponent } from './pages/patients-page/patients-page.component';
import { InformsPageComponent } from './pages/informs-page/informs-page.component';
import { FormsPageComponent } from './pages/forms-page/forms-page.component';
import { ChatsPageComponent } from './pages/chats-page/chats-page.component';
import { ProfilePageComponent } from './pages/profile-page/profile-page.component';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [
    MainLayoutComponent,
    HeroPageComponent,
    PatientsPageComponent,
    InformsPageComponent,
    FormsPageComponent,
    ChatsPageComponent,
    ProfilePageComponent,
  ],
  imports: [
    CommonModule,
    MainRoutingModule,
    RouterModule
  ],
  exports: [
    MainLayoutComponent,
    HeroPageComponent,
    PatientsPageComponent,
    InformsPageComponent,
    FormsPageComponent,
    ChatsPageComponent,
    ProfilePageComponent,
  ]
})
export class MainModule { }