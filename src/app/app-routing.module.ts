import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { componente } from './Componentes/componente';
import { loginComponent } from './Componentes/login';
import { mainComponent } from './Componentes/main';

const routes: Routes = [
  { path: 'componente', component: componente },
  { path: 'login', component: loginComponent },
  { path: 'main', component: mainComponent },
  { path: '', component: loginComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }