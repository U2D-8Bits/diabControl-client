import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { HeroPageComponent } from './pages/hero-page/hero-page.component';
import { PatientsPageComponent } from './pages/patients-page/patients-page.component';
import { InformsPageComponent } from './pages/informs-page/informs-page.component';
import { FormsPageComponent } from './pages/forms-page/forms-page.component';
import { ChatsPageComponent } from './pages/chats-page/chats-page.component';
import { ProfilePageComponent } from './pages/profile-page/profile-page.component';
import { HistoriesPageComponent } from './pages/histories-page/histories-page.component';

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
        //? Guard que verifica si el usuario tiene el rol de medico
        component: PatientsPageComponent
      },
      //Ruta para las historias clinicas de un paciente por id
      {
        path: 'patients/:id',
        title: 'Historias Clinicas',
        //? Guard que verifica si el usuario tiene el rol de medico
        component: HistoriesPageComponent
      },
      {
        path: 'informs',
        title: 'Informes',
        //? Guard que verifica si el usuario tiene el rol de medico
        component: InformsPageComponent
      },
      {
        path: 'forms',
        title: 'Formularios',
        //? Guard que verifica si el usuario tiene el rol de paciente
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
