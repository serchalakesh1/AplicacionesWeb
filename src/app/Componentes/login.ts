import { Component, ViewEncapsulation } from '@angular/core';
import { Firestore, collection, doc, setDoc, query, where, collectionData } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Usuario } from '../Clases/clasesSimples';
import { take } from 'rxjs/operators';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from '@angular/fire/auth';

@Component({
  selector: 'login',
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
  encapsulation: ViewEncapsulation.None
})
export class loginComponent {
  usuario = "";
  contrasena = "";
  newUsuario = "";
  newContrasena = "";
  credencial = new Usuario();
  registerMode = false;

  UsuariosColeccion = collection(this.firestore, 'users'); // Nota: asegúrate de que el nombre de la colección sea 'users'

  constructor(private auth: Auth, private firestore: Firestore, private navegacion: Router) {}

  toggleRegister(event: Event) {
    event.preventDefault();
    this.registerMode = !this.registerMode;
  }

  // Login
  login() {
    if (this.usuario.trim() === "" || this.contrasena.trim() === "") {
      alert("Por favor, ingrese usuario y contraseña válidos.");
      return;
    }

    signInWithEmailAndPassword(this.auth, this.usuario, this.contrasena)
      .then(userCredential => {
        console.log("Login exitoso:", userCredential.user);

        // Guarda el UID del usuario en localStorage
        localStorage.setItem('UsuarioId', userCredential.user.uid);

        // Navegar a la vista principal
        this.navegacion.navigate(['/main']);
      })
      .catch(error => {
        console.error("Error en el login:", error);
        alert("Error en el login: " + error.message);
      });
  }

  // Registro
  register() {
    if (this.newUsuario.trim() === "" || this.newContrasena.trim() === "") {
      alert("Por favor, ingrese un nombre de usuario y contraseña válidos.");
      return;
    }
  
    console.log('Registrando usuario:', this.newUsuario);
  
    createUserWithEmailAndPassword(this.auth, this.newUsuario, this.newContrasena)
      .then(userCredential => {
        console.log("Usuario registrado exitosamente:", userCredential.user);
  
        // UID del usuario recién creado
        const newUserId = userCredential.user.uid;
  
        // Crear el objeto del usuario (como en tu método anterior)
        const newUser = new Usuario();
        newUser.UsuarioID = newUserId;
        newUser.Usuario = this.newUsuario;
        newUser.Nombre = ""; // Campo inicial vacío
        newUser.Contrasena = this.newContrasena; // Aunque guardes esto aquí, recuerda: no es seguro guardar contraseñas en texto plano.
  
        // Crear una referencia al documento del usuario en Firestore
        const userDocRef = doc(this.firestore, `users/${newUserId}`);
  
        // Guardar la información del usuario en Firestore
        setDoc(userDocRef, JSON.parse(JSON.stringify(newUser)))
          .then(() => {
            console.log("Información adicional guardada en Firestore");
            alert("Registro exitoso");
            this.toggleRegister(new Event('click')); // Regresar al modo de inicio de sesión
          })
          .catch(error => {
            console.error("Error al guardar información adicional en Firestore:", error);
            alert("Registro fallido: no se pudo guardar información adicional.");
          });
      })
      .catch(error => {
        console.error("Error en el registro:", error);
        alert("Error en el registro: " + error.message);
      });
  }
  
}
