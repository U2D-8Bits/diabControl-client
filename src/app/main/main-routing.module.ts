import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { HeroPageComponent } from './pages/hero-page/hero-page.component';
import { PatientsPageComponent } from './pages/patients-page/patients-page.component';
import { InformsPageComponent } from './pages/informs-page/informs-page.component';
import { FormsPageComponent } from './pages/forms-page/forms-page.component';
import { ChatsPageComponent } from './pages/chats-page/chats-page.component';
import { ProfilePageComponent } from './pages/profile-page/profile-page.component';

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
      {
        path: 'informs',
        title: 'Informes',
        component: InformsPageComponent
      },
      {
        path: 'forms',
        title: 'Formularios',
        component: FormsPageComponent
      },
      {
        path: 'chats',
        title: 'Chats',
        component: ChatsPageComponent
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
