
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
import { InformsPageComponent } from './pages/informs-page/informs-page.component';
import { ListCategoriesComponent } from './components/categories/list-categories/list-categories.component';
import { ListMedicineComponent } from './components/medicines/list-medicine/list-medicine.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { MainRoutingModule } from './main-routing.module';
import { MaterialuiModule } from '../materialui/materialui.module';
import { MedsPageComponent } from './pages/meds-page/meds-page.component';
import { NgModule } from '@angular/core';
import { PatientsPageComponent } from './pages/patients-page/patients-page.component';
import { PrimengModule } from '../primeng/primeng.module';
import { ProfilePageComponent } from './pages/profile-page/profile-page.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SafeUrlPipe } from './pipes/safe-url.pipe';
import { SharedModule } from '../shared/shared.module';
import { ShowMedicinePageComponent } from './pages/meds/show-medicine-page/show-medicine-page.component';
import { ViewActComponent } from './components/Act/view-act/view-act.component';
import { ViewCategoryComponent } from './components/categories/view-category/view-category.component';
import { ViewHistoryComponent } from './components/histories/view-history/view-history.component';
import { ViewMedicComponent } from './components/medic/view-medic/view-medic.component';
import { ViewMedicineComponent } from './components/medicines/view-medicine/view-medicine.component';
import { ViewPatientComponent } from './components/patient/view-patient/view-patient.component';

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
    ShowMedicinePageComponent,
  ],
  imports: [
    CommonModule,
    MainRoutingModule,
    RouterModule,
    ReactiveFormsModule,

    PrimengModule,
    MaterialuiModule,
    SharedModule,
  ],
  exports: [
    MainLayoutComponent,
    HeroPageComponent,
    PatientsPageComponent,
    InformsPageComponent,
    ProfilePageComponent,
  ]
})
export class MainModule { }
