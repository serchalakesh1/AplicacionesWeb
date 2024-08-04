import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { componente } from './Componentes/componente';
import { loginComponent } from './Componentes/login';
import { MainComponent } from './Componentes/main';
import { tableroWorkspaceComponent } from './Componentes/tableroWorkspace';
import { loginguard } from './guards/login.guard';

const routes: Routes = [
  { path: 'componente', component: componente},
  { path: 'login', component: loginComponent },
  { path: 'main', component: MainComponent, canActivate: [loginguard]},
  { path: 'tableros', component: tableroWorkspaceComponent, canActivate: [loginguard]},
  { path: 'workspace', component: tableroWorkspaceComponent, canActivate: [loginguard]},
  { path: '', component: loginComponent, canActivate: [loginguard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }