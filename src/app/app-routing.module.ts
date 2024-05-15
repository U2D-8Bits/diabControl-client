import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Page404Component } from './shared/pages/page404/page404.component';
import { authenticatedGuard, notAuthenticatedGuard } from './auth/guards';


const routes: Routes = [
  {
    path: 'auth',
    // Guard que verifica si el usuario no esta autenticado
    canActivate: [notAuthenticatedGuard],
    loadChildren: () => import('./auth/auth.module').then( m => m.AuthModule)
  },
  {
    path: 'main',
    // Guard que verifica si el usuario esta autenticado
    canActivate: [authenticatedGuard],
    loadChildren: () => import('./main/main.module').then( m => m.MainModule)
  },
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full'
  },
  {
    path: '**',
    component: Page404Component,
    pathMatch: 'full'
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
