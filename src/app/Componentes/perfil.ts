import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { Firestore, doc, getDoc, setDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs/operators';
import { Listas, Tablero, Usuario } from '../Clases/clasesSimples';
import { collection, collectionData, query, addDoc, serverTimestamp, orderBy } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';

@Component({
  selector: 'app-main',
  templateUrl: './perfil.html',
  styleUrls: ['./GeneralStyles.css'],
  encapsulation: ViewEncapsulation.None
})
export class perfilComponent implements OnInit {
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
    private router: Router,
    private auth: Auth
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
      this.router.navigate(['/workspace'], { queryParams: { id: tableroId, color, nombre } });
    }).catch((error) => {
      console.error("Error updating recent open time:", error);
    });
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
    const uid = this.auth.currentUser?.uid;
    if (!uid) {
      console.error("No UID found for authenticated user.");
      return;
    }

    const filePath = `images/${uid}`;
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
    const uid = this.auth.currentUser?.uid;
    if (!uid) {
      console.error("No UID found for authenticated user.");
      return;
    }

    const userProfileDocRef = doc(this.firestore, `users/${uid}`);
    try {
      await setDoc(userProfileDocRef, { Perfil: url }, { merge: true });
      console.log("Profile image URL updated successfully");
    } catch (error) {
      console.error("Error al actualizar la URL de la imagen del perfil:", error);
    }
  }

  async saveProfile() {
    const nameRegex = /^[a-zA-Z\s]+$/;
    if (!nameRegex.test(this.name)) {
      alert('El nombre solo puede contener letras y espacios.');
      return;
    }

    const usernameRegex = /^[a-zA-Z0-9]+$/;
    if (!usernameRegex.test(this.username)) {
      alert('El nombre de usuario solo puede contener letras y números, sin espacios.');
      return;
    }

    const uid = this.auth.currentUser?.uid;
    if (!uid) {
      console.error("No UID found for authenticated user.");
      return;
    }

    const userProfileDocRef = doc(this.firestore, `users/${uid}`);
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
    this.auth.signOut().then(() => {
      this.router.navigate(['/login']);
    }).catch((error) => {
      console.error("Error during logout:", error);
    });
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
