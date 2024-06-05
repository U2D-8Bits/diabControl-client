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

@NgModule({
  declarations: [
    MainLayoutComponent,
    HeroPageComponent,
    PatientsPageComponent,
    InformsPageComponent,
    FormsPageComponent,
    ChatsPageComponent,
    ProfilePageComponent,
    FirstCharacterPipe,
    ViewPatientComponent,
    CreatePatientComponent,
    CreateMedicComponent,
    ViewMedicComponent,
    CreateFormComponent,
    ViewFormComponent,
    HistoriesPageComponent,
  ],
  imports: [
    CommonModule,
    MainRoutingModule,
    RouterModule,
    ReactiveFormsModule,

    PrimengModule,
    MaterialuiModule,
    SharedModule
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
