import { Component } from '@angular/core';
import { Firestore, collection, collectionData, query, doc, setDoc, deleteDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Usuario, Tableros } from '../Clases/clasesSimples';
import { newArray } from '@angular/compiler/src/util';

@Component({
  selector: 'main',
  templateUrl: './main.html',
  styleUrls: ['./main.css']
})

export class mainComponent {
    credencial = new Usuario();
    nuevoElemento = new Tableros();
    listaTableros: Tableros[] = new Array();

    TablerosBD = collection(this.firestore, "CosoDB");

    constructor(private firestore: Firestore) {
        this.credencial = history.state;

        let q = query(this.TablerosBD);
        collectionData(q).subscribe((Tablerosnap) => {
            this.listaTableros = new Array()
            Tablerosnap.forEach((item) => {
                let element = new Tableros();
                element.setData(item);
                this.listaTableros.push(element);
            });
        });
    }

    abrirModalNuevoElemento() {
        this.nuevoElemento = new Tableros();
        this.nuevoElemento.usuarioCreacion = this.credencial.Usuario;
    }

    agregarElemento() {
        this.nuevoElemento.elementoId = this.generateRandomString(15);
        let rutaDoc = doc(this.firestore, "CosoDB", this.nuevoElemento.elementoId);
        setDoc(rutaDoc, JSON.parse(JSON.stringify(this.nuevoElemento))).then(() => {
            //alert("Registro exitoso");
            let btncerrar = document.getElementById("btnCerrarModalElemento");
            btncerrar?.click();
            window.location.reload();  // Recargar la página
        }).catch(error => {
            console.error("Error agregando el documento: ", error);
        });
    }

    
    
    abrirModalEditarElemento(tablero: Tableros) {
        this.nuevoElemento = tablero;
        this.nuevoElemento.usuarioCreacion = this.credencial.Usuario;
    }

    generateRandomString(num: number) {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result1 = '';
        const charactersLength = characters.length;
        for (let i = 0; i < num; i++) {
            result1 += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result1;
    }
}
