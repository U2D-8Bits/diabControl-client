import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { RestorePasswordPageComponent } from './pages/restore-password-page/restore-password-page.component';
import { AboutUsPageComponent } from './pages/about-us-page/about-us-page.component';

const routes: Routes = [
  {
    path: '',
    component: AuthLayoutComponent,
    children:[
      {
        path: 'home',
        title: 'Inicio',
        component: HomePageComponent
      },
      {
        path: 'login',
        title: 'Iniciar sesión',
        component: LoginPageComponent
      },
      {
        path: 'restore-password',
        title: 'Restablecer contraseña',
        component: RestorePasswordPageComponent
      },
      {
        path: 'about-us',
        title: 'Sobre nosotros',
        component: AboutUsPageComponent
      },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
