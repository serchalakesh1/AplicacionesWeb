import { Component } from '@angular/core';
import { Firestore, collection, collectionData, query, where } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Usuario, elemento } from '../Clases/clasesSimples';
import { doc, setDoc } from 'firebase/firestore';

@Component({
  selector: 'main',
  templateUrl: './main.html',
  styleUrls: ['./main.css']
})





export class mainComponent{

    credencial=new Usuario();
    nuevoElemento=new elemento();
    listaElementos: elemento[]=new Array();

    elementosBD = collection(this.firestore, "Elementos");

    constructor(private firestore:Firestore){
        //this.nombre=history.state.nom!


        this.credencial=history.state;

        let q = query(this.elementosBD )
        collectionData(q).subscribe((elementoSnap)=>{

            elementoSnap.forEach((item)=>{
                let element= new elemento;
                element.setData(item)
                this.listaElementos.push(element)
            })

        }
        
        
        )

    }

    abrirModalNuevoElemento(){

        this.nuevoElemento=new elemento();
        this.nuevoElemento.usuarioCreacion=this.credencial.Usuario;


    
    }

    agregarElemento(){
        this.nuevoElemento.elementoId=this.generateRandomString(15);
        let rutaDoc=doc(this.firestore,"Elementos", this.nuevoElemento.elementoId);
        setDoc(rutaDoc,JSON.parse(JSON.stringify(this.nuevoElemento)))
        alert("Registro exitante")
        let btncerrar=document.getElementById("btnCerrarModalElemento")
        btncerrar?.click()


    }

    generateRandomString = (num: number) =>{
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result1 = '';
        const charactersLength = characters.length;
        for (let i=0; i < num; i++) {
        result1 += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result1;
    }
    
}



