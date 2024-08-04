import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { Firestore, collection, doc, collectionData, query } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Usuario, Tablero, Listas } from '../Clases/clasesSimples';
import { setDoc } from 'firebase/firestore';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-main',
  templateUrl: './main.html',
  styleUrls: ['./GeneralStyles.css'],
  encapsulation: ViewEncapsulation.None
})
export class MainComponent{

  credencial = new Usuario();
  nuevoElemento = new Tablero();
  listaTableros: Tablero[] = [];
  selectedColor: any = null;

  constructor(private firestore:Firestore, private router: Router){
    
    const usuarioId = localStorage.getItem('UsuarioId');
    const TablerosBD = collection(this.firestore, "users/" + usuarioId + "/Tableros");


    this.credencial=history.state;

    let q = query(TablerosBD )
    collectionData(q).subscribe((Tablerosnap)=>{
      this.listaTableros = []; // Reinicia la lista para evitar duplicados
        Tablerosnap.forEach((item)=>{
            let element= new Tablero;
            element.setData(item)
            this.listaTableros.push(element)
        })

    }
    
    
    )

}

ngOnInit() {
}

  colors = [
    { backgroundColor: '34, 140, 213', backgroundImage: 'url(/assets/707f35bc691220846678.svg)' },
    { backgroundColor: '11, 80, 175', backgroundImage: 'url(/assets/d106776cb297f000b1f4.svg)' },
    { backgroundColor: '103, 66, 132', backgroundImage: 'url(/assets/8ab3b35f3a786bb6cdac.svg)' },
    { backgroundColor: '168, 105, 193', backgroundImage: 'url(/assets/a7c521b94eb153008f2d.svg)' },
    { backgroundColor: '239, 118, 58', backgroundImage: 'url(/assets/aec98becb6d15a5fc95e.svg)' }
  ];

  onBoardTitleInput() {
    console.log('Título ingresado: ' + this.nuevoElemento.Nombre);
  }

  selectColor(color: any) {
    this.selectedColor = color;
    this.nuevoElemento.Color = color.backgroundColor; // Asigna el color seleccionado al nuevo elemento
  }  

  createBoard() {
    if (this.nuevoElemento.Nombre.trim().length === 0 || this.selectedColor === null) {
      alert('Debe ingresar un título y seleccionar un color antes de crear el tablero.');
      return;
    }

    // Lógica para crear el tablero
    alert("Creando tablero con título: " + this.nuevoElemento.Nombre + " y color: " + this.selectedColor);
    this.nuevoElemento.TableroID = this.generateRandomString(15);

    // Obtener el UsuarioId del localStorage
    const usuarioId = localStorage.getItem('UsuarioId');
    // Construir una referencia al documento del usuario
    const userDocRef = doc(this.firestore, `users/${usuarioId}`);
      
    // Construir una referencia a la subcolección 'Tableros' dentro del documento del usuario
    const tableroDocRef = doc(userDocRef, 'Tableros', this.nuevoElemento.TableroID);
    
    // Guardar el nuevo tablero en la subcolección
    setDoc(tableroDocRef, JSON.parse(JSON.stringify(this.nuevoElemento))).then(() => {
      console.log('Tablero creado con éxito');
      this.listaTableros.push(this.nuevoElemento); // Añadir el nuevo tablero a la lista
      let btncerrar = document.getElementById("btnCerrarModalElemento");
      btncerrar?.click();
    }).catch((error) => {
      console.error("Error al crear el tablero:", error);
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

  navigateToWorkspace(tableroId: string, color: string) {
    this.router.navigate(['/workspace'], { queryParams: { id: tableroId, color: color } });
  }

}
