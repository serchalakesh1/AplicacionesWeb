import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class loginguard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): boolean {
    if (localStorage.getItem('UsuarioId')) {
      return true;
    } else {
      alert("No estás logueado");
      this.router.navigate(['/login']);
      return false;
    }
  }
}
