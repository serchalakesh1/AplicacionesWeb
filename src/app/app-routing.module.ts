import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { componente } from './Componentes/componente';
import { loginComponent } from './Componentes/login';
import { MainComponent } from './Componentes/main';
import { perfilComponent } from './Componentes/perfil';
import { tableroWorkspaceComponent } from './Componentes/tableroWorkspace';
import { loginguard } from './guards/login.guard';
import { loginreverseguard } from './guards/login.reverseguard';
import { customer_serviceComponent } from './Componentes/customer_service';

const routes: Routes = [
  //{ path: 'componente', component: componente }, solo sirve para recordar como hacer un componente jajaja
  { path: 'login', component: loginComponent},
  { path: 'main', component: MainComponent, canActivate: [loginguard] },
  { path: 'tableros', component: tableroWorkspaceComponent, canActivate: [loginguard] },
  { path: 'workspace', component: tableroWorkspaceComponent, canActivate: [loginguard] },
  { path: 'perfil', component: perfilComponent, canActivate: [loginguard] },
  { path: 'customer_service', component: customer_serviceComponent, canActivate: [loginguard] },
  { path: '', component: loginComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
