import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Firebase modular imports
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getStorage, provideStorage } from '@angular/fire/storage';

// Componentes
import { loginComponent } from './Componentes/login';
import { componente } from './Componentes/componente';
import { MainComponent } from './Componentes/main';
import { tableroWorkspaceComponent } from './Componentes/tableroWorkspace';
import { perfilComponent } from './Componentes/perfil';
import { customer_serviceComponent } from './Componentes/customer_service';


import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';

// Entorno
import { environment } from 'src/environments/environment';

@NgModule({
  declarations: [
    AppComponent,
    componente,
    loginComponent,
    MainComponent,
    tableroWorkspaceComponent,
    perfilComponent,
    customer_serviceComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireStorageModule,
    AngularFireAuthModule,
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideFirestore(() => getFirestore()),
    provideAuth(() => getAuth()),
    provideStorage(() => getStorage()),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
