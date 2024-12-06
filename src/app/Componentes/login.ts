import { Component, ViewEncapsulation } from '@angular/core';
import { Firestore, collection, doc, setDoc, query, where, collectionData } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Usuario } from '../Clases/clasesSimples';
import { take } from 'rxjs/operators';

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

  constructor(private firestore: Firestore, private navegacion: Router) { }

  toggleRegister(event: Event) {
    event.preventDefault();
    this.registerMode = !this.registerMode;
  }

  login() {
    if (this.usuario.trim() === "" || this.contrasena.trim() === "") {
      alert("Por favor, ingrese usuario y contraseña válidos.");
      return;
    }

    const q = query(this.UsuariosColeccion, where("Usuario", "==", this.usuario), where("Contrasena", "==", this.contrasena));
    collectionData(q).pipe(take(1)).subscribe((UsuarioSnap: any) => {
      if (UsuarioSnap.length != 0) {
        console.log('Usuario encontrado:', UsuarioSnap);

        alert("Acceso Exitoso");
        this.credencial.setData(UsuarioSnap[0]);

        // Guardar UsuarioId en localStorage
        localStorage.setItem('UsuarioId', UsuarioSnap[0].UsuarioID);

        this.navegacion.navigate(['/main'], { state: this.credencial });
      } else {
        console.log('No se encontraron usuarios con esas credenciales');
        alert("No se encontraron usuarios con esas credenciales");
      }
    }, error => {
      console.error("Error al consultar Firestore:", error);
    });
  }

  register() {
    if (this.newUsuario.trim() === "" || this.newContrasena.trim() === "") {
      alert("Por favor, ingrese un nombre de usuario y contraseña válidos.");
      return;
    }

    const usernameRegex = /^[a-zA-Z0-9]+$/; // Solo permite letras y números, sin espacios ni símbolos
    if (!usernameRegex.test(this.newUsuario)) {
      alert("El nombre de usuario solo puede contener letras y números, sin espacios ni símbolos.");
      return;
    }

    console.log('Registrando usuario:', this.newUsuario);
    const q = query(this.UsuariosColeccion, where("Usuario", "==", this.newUsuario));
    collectionData(q).pipe(take(1)).subscribe((UsuarioSnap: any) => {
      if (UsuarioSnap.length == 0) {
        const newUserId = this.generateRandomString(20);
        const newUser = new Usuario();
        newUser.UsuarioID = newUserId;
        newUser.Usuario = this.newUsuario;
        newUser.Nombre = ""; // Deja el nombre en blanco para que el usuario lo configure después
        newUser.Contrasena = this.newContrasena;

        // Crear una referencia al documento del usuario con el ID generado
        const userDocRef = doc(this.firestore, `users/${newUserId}`);

        // Guardar el nuevo usuario en Firestore usando setDoc
        setDoc(userDocRef, JSON.parse(JSON.stringify(newUser))).then(() => {
          console.log('Usuario registrado con éxito');
          alert('Registro exitoso');
          this.toggleRegister(new Event('click'));
        }).catch(error => {
          console.error('Error al registrar usuario:', error);
          alert('Error al registrar usuario');
        });
      } else {
        console.log('El nombre de usuario ya está en uso');
        alert('El nombre de usuario ya está en uso');
      }
    }, error => {
      console.error("Error al consultar Firestore:", error);
    });
  }

  generateRandomString(num: number): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < num; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
}
