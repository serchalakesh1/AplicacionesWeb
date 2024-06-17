import { Component } from '@angular/core';
import { Contacto } from '../Clases/clasesSimples';

@Component({
  selector: 'componente',
  templateUrl: './componente.html',
  styleUrls: ['./componente.css']
})
export class componente {

  listaContactos: Contacto[]=new Array();
  contacto=new Contacto();

  constructor(){

  }
  pushLista(){
    this.listaContactos.push(this.contacto);
    this.contacto=new Contacto();

  }
  
}
