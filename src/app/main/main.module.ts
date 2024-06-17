
import { ActPageComponent } from './pages/act-page/act-page.component';
import { CommonModule } from '@angular/common';
import { CreateActComponent } from './components/Act/create-act/create-act.component';
import { CreateCategoryComponent } from './components/categories/create-category/create-category.component';
import { CreateHistoryComponent } from './components/histories/create-history/create-history.component';
import { CreateMedicComponent } from './components/medic/create-medic/create-medic.component';
import { CreateMedicineComponent } from './components/medicines/create-medicine/create-medicine.component';
import { CreatePatientComponent } from './components/patient/create-patient/create-patient.component';
import { FirstCharacterPipe } from './pipes/first-character.pipe';
import { HeroPageComponent } from './pages/hero-page/hero-page.component';
import { HistoriesPageComponent } from './pages/histories-page/histories-page.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { MainRoutingModule } from './main-routing.module';
import { MaterialuiModule } from '../materialui/materialui.module';
import { NgModule } from '@angular/core';
import { PatientsPageComponent } from './pages/patients-page/patients-page.component';
import { PrimengModule } from '../primeng/primeng.module';
import { ProfilePageComponent } from './pages/profile-page/profile-page.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SafeUrlPipe } from './pipes/safe-url.pipe';
import { SharedModule } from '../shared/shared.module';
import { ViewActComponent } from './components/Act/view-act/view-act.component';
import { ViewCategoryComponent } from './components/categories/view-category/view-category.component';
import { ViewHistoryComponent } from './components/histories/view-history/view-history.component';
import { ViewMedicComponent } from './components/medic/view-medic/view-medic.component';
import { ViewMedicineComponent } from './components/medicines/view-medicine/view-medicine.component';
import { ViewPatientComponent } from './components/patient/view-patient/view-patient.component';
import { ShowMedicinePageComponent } from './components/meds/show-medicine-page/show-medicine-page.component';
import { CategoriesPageComponent } from './pages/categories-page/categories-page.component';
import { MedicinesPageComponent } from './pages/medicines-page/medicines-page.component';
import { FollowUpComponent } from './components/histories/follow-up/follow-up.component';

@NgModule({
  declarations: [
    ActPageComponent,
    CreateActComponent,
    CreateCategoryComponent,
    CreateHistoryComponent,
    CreateMedicComponent,
    CreateMedicineComponent,
    CreatePatientComponent,
    FirstCharacterPipe,
    HeroPageComponent,
    HistoriesPageComponent,
    MainLayoutComponent,
    PatientsPageComponent,
    ProfilePageComponent,
    SafeUrlPipe,
    ViewActComponent,
    ViewCategoryComponent,
    ViewHistoryComponent,
    ViewMedicComponent,
    ViewMedicineComponent,
    ViewPatientComponent,
    ShowMedicinePageComponent,
    CategoriesPageComponent,
    MedicinesPageComponent,
    FollowUpComponent,
  ],
  imports: [
    CommonModule,
    MainRoutingModule,
    RouterModule,
    ReactiveFormsModule,

    PrimengModule,
    MaterialuiModule,
    SharedModule,
    FormsModule,
  ],
  exports: [
    MainLayoutComponent,
    HeroPageComponent,
    PatientsPageComponent,
    ProfilePageComponent,
  ]
})
export class MainModule { }
