import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { HeroPageComponent } from './pages/hero-page/hero-page.component';
import { PatientsPageComponent } from './pages/patients-page/patients-page.component';
import { ProfilePageComponent } from './pages/profile-page/profile-page.component';
import { HistoriesPageComponent } from './pages/histories-page/histories-page.component';
import { ActPageComponent } from './pages/act-page/act-page.component';
import { ShowMedicinePageComponent } from './components/meds/show-medicine-page/show-medicine-page.component';

const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children:[
      {
        path: 'dashboard',
        title: 'Inicio',
        component: HeroPageComponent
      },
      {
        path: 'patients',
        title: 'Pacientes',
        component: PatientsPageComponent
      },
      //Ruta para las historias clinicas de un paciente por id
      {
        path: 'patients/:id',
        title: 'Historias Clinicas',
        component: HistoriesPageComponent
      },
      //Ruat para el Acta CONSENTIMIENTO INFORMADO DE PACIENTES
      {
        path: 'patients/:id/consentimiento',
        title: 'Consentimiento Informado',
        component: ActPageComponent
      },
      {
        path: 'medicines',
        title: 'Medicamentos',
        component: ShowMedicinePageComponent
      },
      {
        path: 'profile',
        title: 'Perfil',
        component: ProfilePageComponent
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
