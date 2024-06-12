import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainRoutingModule } from './main-routing.module';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { HeroPageComponent } from './pages/hero-page/hero-page.component';
import { PatientsPageComponent } from './pages/patients-page/patients-page.component';
import { InformsPageComponent } from './pages/informs-page/informs-page.component';
import { FormsPageComponent } from './pages/forms-page/forms-page.component';
import { ProfilePageComponent } from './pages/profile-page/profile-page.component';
import { RouterModule } from '@angular/router';
import { PrimengModule } from '../primeng/primeng.module';
import { FirstCharacterPipe } from './pipes/first-character.pipe';
import { MaterialuiModule } from '../materialui/materialui.module';
import { ViewPatientComponent } from './components/patient/view-patient/view-patient.component';
import { CreatePatientComponent } from './components/patient/create-patient/create-patient.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CreateMedicComponent } from './components/medic/create-medic/create-medic.component';
import { ViewMedicComponent } from './components/medic/view-medic/view-medic.component';
import { FormsModule } from '@angular/forms';
import { CreateFormComponent } from './components/forms/create-form/create-form.component';
import { ViewFormComponent } from './components/forms/view-form/view-form.component';
import { SharedModule } from '../shared/shared.module';
import { HistoriesPageComponent } from './pages/histories-page/histories-page.component';
import { CreateHistoryComponent } from './components/histories/create-history/create-history.component';
import { ViewHistoryComponent } from './components/histories/view-history/view-history.component';
import { ActPageComponent } from './pages/act-page/act-page.component';
import { CreateActComponent } from './components/Act/create-act/create-act.component';
import { ViewActComponent } from './components/Act/view-act/view-act.component';
import { SafeUrlPipe } from './pipes/safe-url.pipe';
import { MedsPageComponent } from './pages/meds-page/meds-page.component';
import { ListMedicineComponent } from './components/medicines/list-medicine/list-medicine.component';
import { CreateMedicineComponent } from './components/medicines/create-medicine/create-medicine.component';
import { ViewMedicineComponent } from './components/medicines/view-medicine/view-medicine.component';
import { ListCategoriesComponent } from './components/categories/list-categories/list-categories.component';
import { CreateCategoryComponent } from './components/categories/create-category/create-category.component';
import { ViewCategoryComponent } from './components/categories/view-category/view-category.component';

@NgModule({
  declarations: [
    ActPageComponent,
    CreateActComponent,
    CreateCategoryComponent,
    CreateFormComponent,
    CreateHistoryComponent,
    CreateMedicComponent,
    CreateMedicineComponent,
    CreatePatientComponent,
    FirstCharacterPipe,
    FormsPageComponent,
    HeroPageComponent,
    HistoriesPageComponent,
    InformsPageComponent,
    ListCategoriesComponent,
    ListMedicineComponent,
    MainLayoutComponent,
    MedsPageComponent,
    PatientsPageComponent,
    ProfilePageComponent,
    SafeUrlPipe,
    ViewActComponent,
    ViewCategoryComponent,
    ViewHistoryComponent,
    ViewMedicComponent,
    ViewMedicineComponent,
    ViewPatientComponent,
  ],
  imports: [
    CommonModule,
    MainRoutingModule,
    RouterModule,
    ReactiveFormsModule,

    PrimengModule,
    MaterialuiModule,
    SharedModule,
    FormsModule
  ],
  exports: [
    MainLayoutComponent,
    HeroPageComponent,
    PatientsPageComponent,
    InformsPageComponent,
    FormsPageComponent,
    ProfilePageComponent,
  ]
})
export class MainModule { }
