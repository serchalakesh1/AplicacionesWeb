import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { Firestore, doc, getDoc, setDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs/operators';
import { Listas, Tablero, Usuario } from '../Clases/clasesSimples';
import { collection, collectionData, query, addDoc, serverTimestamp, orderBy, docData} from '@angular/fire/firestore';

@Component({
  selector: 'app-main',
  templateUrl: './customer_service.html',
  styleUrls: ['./GeneralStyles.css'],
  encapsulation: ViewEncapsulation.None
})
export class customer_serviceComponent implements OnInit {
  userProfileImageUrl: string = '';
  name: string = '';
  username: string = '';
  bio: string = '';
  currentPassword: string = '';
  newPassword: string = '';
  credencial = new Usuario();
  listaTableros: Listas[] = [];
  listaTablerostime: Tablero[] = [];
  listaTablerosRecent: Tablero[] = [];

  constructor(
    private firestore: Firestore,
    private storage: AngularFireStorage,
    private router: Router
  ) {}

  ngOnInit() {
    if (localStorage.getItem('reloaded') === null) {
      localStorage.setItem('reloaded', 'true');
      location.reload();
    } else {
      localStorage.removeItem('reloaded');
      this.loadUserProfile();
      this.loadUserBoardstime();
      this.loadUserBoardsRecent();
    }
  }  


  navigateToWorkspace(tableroId: string, color: string, nombre: string) {
    const usuarioId = localStorage.getItem('UsuarioId');

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

  async loadUserProfile() {
    const usuarioId = localStorage.getItem('UsuarioId');
    const userProfileDocRef = doc(this.firestore, `users/${usuarioId}`);
    try {
      const docSnapshot = await getDoc(userProfileDocRef);
      if (docSnapshot.exists()) {
        const userProfileData = docSnapshot.data();
        this.userProfileImageUrl = userProfileData['Perfil'] || '';
        this.name = userProfileData['Nombre'] || '';
        this.username = userProfileData['Usuario'] || '';
        this.bio = userProfileData['Bio'] || '';
      } else {
        console.warn('No profile data found for user.');
      }
    } catch (error) {
      console.error("Error al cargar el perfil del usuario:", error);
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

  onProfilePicClick() {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    fileInput.click();
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.uploadImage(file);
    }
  }

  uploadImage(file: File) {
    const usuarioId = localStorage.getItem('UsuarioId');
    const filePath = `images/${usuarioId}`; // El nombre del archivo será el UsuarioId
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);

    task.snapshotChanges().pipe(
      finalize(() => {
        fileRef.getDownloadURL().subscribe((url) => {
          this.userProfileImageUrl = url;
          this.updateUserProfileImageUrl(url);
        });
      })
    ).subscribe();
  }

  async updateUserProfileImageUrl(url: string) {
    const usuarioId = localStorage.getItem('UsuarioId');
    const userProfileDocRef = doc(this.firestore, `users/${usuarioId}`);
    try {
      await setDoc(userProfileDocRef, { Perfil: url }, { merge: true });
      console.log("Profile image URL updated successfully");
    } catch (error) {
      console.error("Error al actualizar la URL de la imagen del perfil:", error);
    }
  }

  async saveProfile() {
    const nameRegex = /^[a-zA-Z\s]+$/; // Solo permite letras y espacios
    if (!nameRegex.test(this.name)) {
      alert('El nombre solo puede contener letras y espacios.');
      return;
    }

    const usernameRegex = /^[a-zA-Z0-9]+$/; // Solo permite letras y números, sin espacios
    if (!usernameRegex.test(this.username)) {
      alert('El nombre de usuario solo puede contener letras y números, sin espacios.');
      return;
    }

    const usuarioId = localStorage.getItem('UsuarioId');
    const userProfileDocRef = doc(this.firestore, `users/${usuarioId}`);

    try {
      await setDoc(userProfileDocRef, {
        Nombre: this.name,
        Usuario: this.username,
        Bio: this.bio
      }, { merge: true });
      alert('Perfil actualizado con éxito.');
    } catch (error) {
      console.error("Error al guardar el perfil del usuario:", error);
      alert('Error al actualizar el perfil.');
    }
  }

  async savePassword() {
    const usuarioId = localStorage.getItem('UsuarioId');
    const userProfileDocRef = doc(this.firestore, `users/${usuarioId}`);

    try {
      const docSnapshot = await getDoc(userProfileDocRef);
      if (docSnapshot.exists()) {
        const userProfileData = docSnapshot.data();
        if (userProfileData['Contrasena'] !== this.currentPassword) {
          alert('La contraseña actual es incorrecta.');
          return;
        }

        await setDoc(userProfileDocRef, { Contrasena: this.newPassword }, { merge: true });
        alert('Contraseña actualizada con éxito.');
      } else {
        console.warn('No profile data found for user.');
      }
    } catch (error) {
      console.error("Error al actualizar la contraseña:", error);
      alert('Error al actualizar la contraseña.');
    }
  }
  

  logginout() {
    localStorage.removeItem('UsuarioId');
    this.router.navigate(['/login']);
  }

  perfil() {
    this.router.navigate(['/perfil']);
  }

  services() {
    this.router.navigate(['/customer_service']);
  }

  goToMain() {
    this.router.navigate(['/main']);
  }
}
