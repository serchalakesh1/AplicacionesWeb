import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { Firestore, doc, getDoc, setDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-main',
  templateUrl: './perfil.html',
  styleUrls: ['./GeneralStyles.css'],
  encapsulation: ViewEncapsulation.None
})
export class perfilComponent implements OnInit {

  userProfileImageUrl: string = '';

  constructor(
    private firestore: Firestore,
    private storage: AngularFireStorage,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadUserProfile();
  }

  async loadUserProfile() {
    const usuarioId = localStorage.getItem('UsuarioId');
    const userProfileDocRef = doc(this.firestore, `users/${usuarioId}`);
    try {
      const docSnapshot = await getDoc(userProfileDocRef);
      if (docSnapshot.exists()) {
        const userProfileData = docSnapshot.data();
        this.userProfileImageUrl = userProfileData['Perfil'] || '';
      } else {
        console.warn('No profile data found for user.');
      }
    } catch (error) {
      console.error("Error al cargar el perfil del usuario:", error);
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

  logginout() {
    localStorage.removeItem('UsuarioId');
    this.router.navigate(['/login']);
  }

  perfil() {
    this.router.navigate(['/perfil']);
  }

  goToMain() {
    this.router.navigate(['/main']);
  }
}
