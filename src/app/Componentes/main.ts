import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { Firestore, doc, getDoc, collection, query, collectionData, serverTimestamp } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Usuario, Tablero } from '../Clases/clasesSimples';
import { setDoc, orderBy, deleteDoc } from 'firebase/firestore';


@Component({
  selector: 'app-main',
  templateUrl: './main.html',
  styleUrls: ['./GeneralStyles.css'],
  encapsulation: ViewEncapsulation.None
})
export class MainComponent implements OnInit {

  credencial = new Usuario();
  nuevoElemento = new Tablero();
  listaTableros: Tablero[] = [];
  listaTablerostime: Tablero[] = [];
  listaTablerosRecent: Tablero[] = [];
  selectedColor: any = null;
  userProfileImageUrl: string = '';

  constructor(private firestore: Firestore, private router: Router) {}

  ngOnInit() {
    this.loadUserProfile();
    this.loadUserBoards();
    this.loadUserBoardstime();
    this.loadUserBoardsRecent();
  }

  async loadUserProfile() {
    const usuarioId = localStorage.getItem('UsuarioId');

    const userProfileDocRef = doc(this.firestore, `users/${usuarioId}`);
    try {
      const docSnapshot = await getDoc(userProfileDocRef);
      if (docSnapshot.exists()) {
        const userProfileData = docSnapshot.data();
        console.log('User profile data:', userProfileData); // Verificar datos del perfil del usuario
        this.userProfileImageUrl = userProfileData['Perfil'] || '';
        console.log('User profile image URL:', this.userProfileImageUrl); // Verificar URL de la imagen
      } else {
        console.warn('No profile data found for user.');
      }
    } catch (error) {
      console.error("Error al cargar el perfil del usuario:", error);
    }
  }

  
  async loadUserBoards() {
    const usuarioId = localStorage.getItem('UsuarioId');
    const TablerosBD = collection(this.firestore, `users/${usuarioId}/Tableros`);
    this.credencial = history.state;

    const q = query(TablerosBD, orderBy('Nombre', 'asc')); // Order by 'Nombre' in ascending order

    try {
      collectionData(q).subscribe((Tablerosnap) => {
        this.listaTableros = []; // Reinicia la lista para evitar duplicados
        Tablerosnap.forEach((item) => {
          let element = new Tablero();
          element.setData(item);
          this.listaTableros.push(element);
        });
        console.log('Boards loaded:', this.listaTableros); // Verificar que se cargaron los tableros
      });
    } catch (error) {
      console.error("Error al cargar los tableros del usuario:", error);
    }
}


async loadUserBoardstime() {
  const usuarioId = localStorage.getItem('UsuarioId');
  const TablerosBD = collection(this.firestore, `users/${usuarioId}/Tableros`);
  this.credencial = history.state;

  const q = query(TablerosBD, orderBy('Timestamp', 'desc')); // Order by 'Timestamp' in descending order

  try {
    collectionData(q).subscribe((Tablerosnap) => {
      this.listaTablerostime = []; // Reset the list to avoid duplicates
      Tablerosnap.forEach((item) => {
        let element = new Tablero();
        element.setData(item);
        this.listaTablerostime.push(element);
      });
      console.log('Boards loaded:', this.listaTableros); // Verify that the boards are loaded
    });
  } catch (error) {
    console.error("Error al cargar los tableros del usuario:", error);
  }
}

async loadUserBoardsRecent() {
  const usuarioId = localStorage.getItem('UsuarioId');
  const TablerosBD = collection(this.firestore, `users/${usuarioId}/Tableros`);
  this.credencial = history.state;

  const q = query(TablerosBD, orderBy('recentOpen', 'desc')); // Order by 'Timestamp' in descending order

  try {
    collectionData(q).subscribe((Tablerosnap) => {
      this.listaTablerosRecent = []; // Reset the list to avoid duplicates
      Tablerosnap.forEach((item) => {
        let element = new Tablero();
        element.setData(item);
        this.listaTablerosRecent.push(element);
      });
      console.log('Boards loaded:', this.listaTableros); // Verify that the boards are loaded
    });
  } catch (error) {
    console.error("Error al cargar los tableros del usuario:", error);
  }
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

    this.nuevoElemento.TableroID = this.generateRandomString(15);
    this.nuevoElemento.Timestamp = serverTimestamp(); // Set the server timestamp

    const usuarioId = localStorage.getItem('UsuarioId');
    if (!usuarioId) {
      console.error("No user ID found in localStorage.");
      this.router.navigate(['/login']);
      return;
    }

    const userDocRef = doc(this.firestore, `users/${usuarioId}`);
    const tableroDocRef = doc(userDocRef, 'Tableros', this.nuevoElemento.TableroID);

    setDoc(tableroDocRef, JSON.parse(JSON.stringify(this.nuevoElemento))).then(() => {
      console.log('Tablero creado con éxito');
      this.listaTableros.push(this.nuevoElemento);
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

  navigateToWorkspace(tableroId: string, color: string, nombre: string) {
    const usuarioId = localStorage.getItem('UsuarioId');
    if (!usuarioId) {
      console.error("No user ID found in localStorage.");
      this.router.navigate(['/login']);
      return;
    }

    const userDocRef = doc(this.firestore, `users/${usuarioId}`);
    const tableroDocRef = doc(userDocRef, 'Tableros', tableroId);

    // Update the recentOpen field with the current server timestamp
    const recentOpenUpdate = {
        recentOpen: serverTimestamp()
    };

    setDoc(tableroDocRef, recentOpenUpdate, { merge: true }).then(() => {
        console.log('Recent open time updated successfully');
        this.router.navigate(['/workspace'], { queryParams: { id: tableroId, color: color, nombre: nombre } });
    }).catch((error) => {
        console.error("Error updating recent open time:", error);
    });
}

  logginout() {
    localStorage.removeItem('UsuarioId');
    this.router.navigate(['/login']);
  }


  gotoperfil() {
    this.router.navigate(['/perfil']);
  }

  services() {
    this.router.navigate(['/customer_service']);
  }
  
  DeletedBoard(boardID: string) {
    const usuarioId = localStorage.getItem('UsuarioId');

    // Usamos la función collection para obtener la referencia a la colección de tableros
    const tableroCollectionRef = collection(this.firestore, `users/${usuarioId}/Tableros`);
    // Usamos la función doc para obtener la referencia al documento específico del tablero
    const tableroDocRef = doc(tableroCollectionRef, boardID);
    
    // Eliminamos el documento
    deleteDoc(tableroDocRef).then(() => {
      console.log(`Tablero con ID ${boardID} ha sido eliminado.`);
      // Aquí puedes añadir cualquier acción que quieras realizar después de eliminar el tablero
    }).catch(error => {
      console.error("Error al eliminar el tablero: ", error);
    });
  }
}
