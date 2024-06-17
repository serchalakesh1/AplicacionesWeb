import { Component } from '@angular/core';
import { Firestore, collection, collectionData, query, where } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Usuario } from '../Clases/clasesSimples';

@Component({
  selector: 'login',
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class loginComponent {
  usuario = "";
  contrasena = "";
credencial=new Usuario();

  UsuariosColeccion = collection(this.firestore, 'users'); // Nota: asegúrate de que el nombre de la colección sea 'users'

  constructor(private firestore: Firestore, private navegacion: Router ) { }

  login() {
    console.log('Iniciando sesión con:', this.usuario, this.contrasena);
    const q = query(this.UsuariosColeccion, where("Usuario", "==", this.usuario), where("Contrasena", "==", this.contrasena));
    collectionData(q).subscribe((UsuarioSnap: any) => {
      console.log('Resultado de la consulta:', UsuarioSnap)
      if (UsuarioSnap.length != 0) {
        console.log('Usuario encontrado:', UsuarioSnap);


        alert("Acceso Exitoso");
        //let nombre=UsuarioSnap[0].Nombre
        
        //this.navegacion.navigate(['/main'],{state: {nom: UsuarioSnap[0].Nombre!} })
       // this.credencial.Nombre=UsuarioSnap[0].nombre
       this.credencial.setData(UsuarioSnap[0])

        this.navegacion.navigate(['/main'],{state: this.credencial} )


      } else {
        console.log('No se encontraron usuarios con esas credenciales');
        alert("No se encontraron usuarios con esas credenciales");
      }
    }, error => {
      console.error("Error al consultar Firestore:", error);
    });
  }
}