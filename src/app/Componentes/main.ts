import { Component, ViewEncapsulation } from '@angular/core';
import { Firestore, collection, collectionData, query, where } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Usuario, elemento, Tableros } from '../Clases/clasesSimples';
import { doc, setDoc } from 'firebase/firestore';

@Component({
  selector: 'main',
  templateUrl: './main.html',
  styleUrls: ['./GeneralStyles.css'],
  encapsulation: ViewEncapsulation.None
})




export class mainComponent{
}