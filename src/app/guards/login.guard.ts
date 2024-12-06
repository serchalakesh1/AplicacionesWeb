import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Auth, onAuthStateChanged, signOut } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class loginguard implements CanActivate {

  constructor(private auth: Auth, private router: Router) {}

  canActivate(): Promise<boolean> {
    return new Promise((resolve) => {
      onAuthStateChanged(this.auth, (user) => {
        if (user) {
          const storedUsuarioId = localStorage.getItem('UsuarioId'); // Obtener el UsuarioId del localStorage
          resolve(true); // Coinciden, permitir acceso
          /*if (storedUsuarioId === user.uid) {
            resolve(true); // Coinciden, permitir acceso
          } else {
            alert("Hubo un problema con tu sesión. Por favor, inicia sesión nuevamente.");
            this.cerrarSesion(); // Cierra la sesión si no coincide
            resolve(false);
          }*/
        } else {
          alert("Necesitas iniciar sesión.");
          this.router.navigate(['/']); // Redirige a la página de login
          resolve(false); // No está autenticado
        }
      });
    });
  }

  /*
  cerrarSesion() {
    signOut(this.auth)
      .then(() => {
        localStorage.removeItem('UsuarioId'); // Limpia el UsuarioId del localStorage
        this.router.navigate(['/']); // Redirige al login
      })
      .catch((error) => {
        console.error("Error al cerrar sesión:", error);
        alert("Hubo un problema al cerrar tu sesión.");
      });
  }
  */
}
