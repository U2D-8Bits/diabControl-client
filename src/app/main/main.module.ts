
import { ActPageComponent } from './pages/act-page/act-page.component';
import { CommonModule } from '@angular/common';
import { CreateActComponent } from './components/Act/create-act/create-act.component';
import { CreateCategoryComponent } from './components/categories/create-category/create-category.component';
import { CreateHistoryComponent } from './components/histories/create-history/create-history.component';
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
import { ViewMedicineComponent } from './components/medicines/view-medicine/view-medicine.component';
import { ViewPatientComponent } from './components/patient/view-patient/view-patient.component';
import { ShowMedicinePageComponent } from './components/meds/show-medicine-page/show-medicine-page.component';
import { CategoriesPageComponent } from './pages/categories-page/categories-page.component';
import { MedicinesPageComponent } from './pages/medicines-page/medicines-page.component';
import { ChatPageComponent } from './pages/chat-page/chat-page.component';
import { MedicsPageComponent } from './pages/medics-page/medics-page.component';
import { CreateMedicComponent } from './components/medic/create-medic/create-medic.component';
import { ViewMedicComponent } from './components/medic/view-medic/view-medic.component';
import { ControlPageComponent } from './pages/control-page/control-page.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { CreateControlComponent } from './components/control/create-control/create-control.component';
import { UpdateControlComponent } from './components/control/update-control/update-control.component';
import { MeetingPageComponent } from './pages/meeting-page/meeting-page.component';
import { SafeUrlMeetingPipe } from './pipes/meeting-url.pipe';
import { ChatMessageComponent } from './components/chat/chat-message/chat-message.component';

@NgModule({
  declarations: [
    ActPageComponent,
    CreateActComponent,
    CreateCategoryComponent,
    CreateHistoryComponent,
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
    ViewMedicineComponent,
    ViewPatientComponent,
    ShowMedicinePageComponent,
    CategoriesPageComponent,
    MedicinesPageComponent,
    ChatPageComponent,
    MedicsPageComponent,
    CreateMedicComponent,
    ViewMedicComponent,
    ControlPageComponent,
    CreateControlComponent,
    UpdateControlComponent,
    MeetingPageComponent,
    SafeUrlMeetingPipe,
    ChatMessageComponent
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
    NgxChartsModule,
  ],
  exports: [
    MainLayoutComponent,
    HeroPageComponent,
    PatientsPageComponent,
    ProfilePageComponent,
  ]
})
export class MainModule { }
