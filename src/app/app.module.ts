import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { loginComponent } from './Componentes/login';   
import { componente } from './Componentes/componente';
import { environment } from 'src/environments/environment';
import { MainComponent } from './Componentes/main';
import { tableroWorkspaceComponent } from './Componentes/tableroWorkspace';


@NgModule({
  declarations: [
    AppComponent,
    componente,
    loginComponent,
    MainComponent,
    tableroWorkspaceComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideFirestore(() => getFirestore())
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }