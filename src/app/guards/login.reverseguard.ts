import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class loginreverseguard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): boolean {
    if (localStorage.getItem('UsuarioId')) {
      this.router.navigate(['/main']);
      return false;
    } else {
      return true;
    }
  }
}
