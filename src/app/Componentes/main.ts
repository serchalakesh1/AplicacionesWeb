import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { Firestore, doc, getDoc, collection, query, collectionData, serverTimestamp } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Usuario, Tablero } from '../Clases/clasesSimples';
import { setDoc, orderBy, deleteDoc } from 'firebase/firestore';
import { Auth } from '@angular/fire/auth';

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

  constructor(private firestore: Firestore, private router: Router, private auth: Auth) {}

  ngOnInit() {
    this.loadUserProfile();
    this.loadUserBoards();
    this.loadUserBoardstime();
    this.loadUserBoardsRecent();
  }

  async loadUserProfile() {
    const uid = this.auth.currentUser?.uid;
    if (!uid) {
      console.error("No UID found for authenticated user.");
      return;
    }

    const userProfileDocRef = doc(this.firestore, `users/${uid}`);
    try {
      const docSnapshot = await getDoc(userProfileDocRef);
      if (docSnapshot.exists()) {
        const userProfileData = docSnapshot.data();
        console.log('User profile data:', userProfileData);
        this.userProfileImageUrl = userProfileData['Perfil'] || '';
        console.log('User profile image URL:', this.userProfileImageUrl);
      } else {
        console.warn('No profile data found for user.');
      }
    } catch (error) {
      console.error("Error al cargar el perfil del usuario:", error);
    }
  }

  async loadUserBoards() {
    const uid = this.auth.currentUser?.uid;
    if (!uid) {
      console.error("No UID found for authenticated user.");
      return;
    }

    const TablerosBD = collection(this.firestore, `users/${uid}/Tableros`);
    this.credencial = history.state;

    const q = query(TablerosBD, orderBy('Nombre', 'asc'));

    try {
      collectionData(q).subscribe((Tablerosnap) => {
        this.listaTableros = [];
        Tablerosnap.forEach((item) => {
          let element = new Tablero();
          element.setData(item);
          this.listaTableros.push(element);
        });
        console.log('Boards loaded:', this.listaTableros);
      });
    } catch (error) {
      console.error("Error al cargar los tableros del usuario:", error);
    }
  }

  async loadUserBoardstime() {
    const uid = this.auth.currentUser?.uid;
    if (!uid) {
      console.error("No UID found for authenticated user.");
      return;
    }

    const TablerosBD = collection(this.firestore, `users/${uid}/Tableros`);
    this.credencial = history.state;

    const q = query(TablerosBD, orderBy('Timestamp', 'desc'));

    try {
      collectionData(q).subscribe((Tablerosnap) => {
        this.listaTablerostime = [];
        Tablerosnap.forEach((item) => {
          let element = new Tablero();
          element.setData(item);
          this.listaTablerostime.push(element);
        });
        console.log('Boards loaded:', this.listaTableros);
      });
    } catch (error) {
      console.error("Error al cargar los tableros del usuario:", error);
    }
  }

  async loadUserBoardsRecent() {
    const uid = this.auth.currentUser?.uid;
    if (!uid) {
      console.error("No UID found for authenticated user.");
      return;
    }

    const TablerosBD = collection(this.firestore, `users/${uid}/Tableros`);
    this.credencial = history.state;

    const q = query(TablerosBD, orderBy('recentOpen', 'desc'));

    try {
      collectionData(q).subscribe((Tablerosnap) => {
        this.listaTablerosRecent = [];
        Tablerosnap.forEach((item) => {
          let element = new Tablero();
          element.setData(item);
          this.listaTablerosRecent.push(element);
        });
        console.log('Boards loaded:', this.listaTableros);
      });
    } catch (error) {
      console.error("Error al cargar los tableros del usuario:", error);
    }
  }

  onBoardTitleInput() {
    console.log('Título ingresado: ' + this.nuevoElemento.Nombre);
  }

  selectColor(color: any) {
    this.selectedColor = color;
    this.nuevoElemento.Color = color.backgroundColor;
  }

  createBoard() {
    if (this.nuevoElemento.Nombre.trim().length === 0 || this.selectedColor === null) {
      alert('Debe ingresar un título y seleccionar un color antes de crear el tablero.');
      return;
    }

    this.nuevoElemento.TableroID = this.generateRandomString(15);
    this.nuevoElemento.Timestamp = serverTimestamp();

    const uid = this.auth.currentUser?.uid;
    if (!uid) {
      console.error("No UID found for authenticated user.");
      this.router.navigate(['/login']);
      return;
    }

    const userDocRef = doc(this.firestore, `users/${uid}`);
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
    const uid = this.auth.currentUser?.uid;
    if (!uid) {
      console.error("No UID found for authenticated user.");
      return;
    }

    const userDocRef = doc(this.firestore, `users/${uid}`);
    const tableroDocRef = doc(userDocRef, 'Tableros', tableroId);

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
    this.auth.signOut().then(() => {
      this.router.navigate(['/login']);
    }).catch((error) => {
      console.error("Error during logout:", error);
    });
  }

  gotoperfil() {
    this.router.navigate(['/perfil']);
  }

  services() {
    this.router.navigate(['/customer_service']);
  }

  DeletedBoard(boardID: string) {
    const uid = this.auth.currentUser?.uid;
    if (!uid) {
      console.error("No UID found for authenticated user.");
      return;
    }

    const tableroDocRef = doc(this.firestore, `users/${uid}/Tableros`, boardID);

    deleteDoc(tableroDocRef).then(() => {
      console.log(`Tablero con ID ${boardID} ha sido eliminado.`);
    }).catch((error) => {
      console.error("Error al eliminar el tablero:", error);
    });
  }

  colors = [
    { backgroundColor: '34, 140, 213', backgroundImage: 'url(/assets/707f35bc691220846678.svg)' },
    { backgroundColor: '11, 80, 175', backgroundImage: 'url(/assets/d106776cb297f000b1f4.svg)' },
    { backgroundColor: '103, 66, 132', backgroundImage: 'url(/assets/8ab3b35f3a786bb6cdac.svg)' },
    { backgroundColor: '168, 105, 193', backgroundImage: 'url(/assets/a7c521b94eb153008f2d.svg)' },
    { backgroundColor: '239, 118, 58', backgroundImage: 'url(/assets/aec98becb6d15a5fc95e.svg)' }
  ];
  
}
