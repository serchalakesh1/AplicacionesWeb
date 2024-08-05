import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Firestore, collection, collectionData, query, addDoc, getDoc, doc } from '@angular/fire/firestore';
import { Listas, Usuario, Tarjeta, Tablero } from '../Clases/clasesSimples';

@Component({
  selector: 'tableroWorkspace',
  templateUrl: './tableroWorkspace.html',
  styleUrls: ['./GeneralStyles.css', './tableroWorkspace.css'],
  encapsulation: ViewEncapsulation.None
})
export class tableroWorkspaceComponent implements OnInit {
  tableroId: string | null = null;
  tableroNombre: string | null = null;
  tableroColor: string | null = null;
  credencial = new Usuario();
  listaTableros: Listas[] = [];
  tarjetasPorLista: { [key: string]: Tarjeta[] } = {}; // Diccionario para almacenar tarjetas por lista
  isModalVisible = false;
  newListName: string = '';
  userProfileImageUrl: string = '';

  constructor(private firestore: Firestore, private router: Router, private route: ActivatedRoute) {
    this.route.queryParams.subscribe(params => {
      this.tableroId = params['id'];
      this.tableroColor = params['color'];
      this.tableroNombre = params['nombre'];
      console.log('Tablero ID:', this.tableroId);
      console.log('Tablero Color:', this.tableroColor);
    });

    const usuarioId = localStorage.getItem('UsuarioId');
    const TablerosBD = collection(this.firestore, `users/${usuarioId}/Tableros/${this.tableroId}/Listas`);
    this.credencial = history.state;

    let q = query(TablerosBD);
    collectionData(q).subscribe((Tablerosnap) => {
      this.listaTableros = [];
      Tablerosnap.forEach((item) => {
        let element = new Listas();
        element.setData(item);
        this.listaTableros.push(element);

        const ListaID = element.ListaID;
        const TarjetasBD = collection(this.firestore, `users/${usuarioId}/Tableros/${this.tableroId}/Listas/${ListaID}/Tarjetas`);
        let qTarjetas = query(TarjetasBD);

        // Inicializar el array de tarjetas para esta lista
        this.tarjetasPorLista[ListaID] = [];

        collectionData(qTarjetas).subscribe((Tarjetasnap) => {
          this.tarjetasPorLista[ListaID] = []; // Reiniciar el array de tarjetas para esta lista
          Tarjetasnap.forEach((tarjetaItem) => {
            let tarjeta = new Tarjeta();
            tarjeta.setData(tarjetaItem);
            this.tarjetasPorLista[ListaID].push(tarjeta);
          });
        });
      });
    });
  }

  ngOnInit() {
    this.loadUserProfile();
  }

  async agregarNuevaLista() {
    if (this.newListName.trim() === '') return;

    const nuevaLista = new Listas();
    nuevaLista.Nombre = this.newListName;
    nuevaLista.ListaID = this.generateRandomString(20);

    const usuarioId = localStorage.getItem('UsuarioId');
    const TablerosBD = collection(this.firestore, `users/${usuarioId}/Tableros/${this.tableroId}/Listas`);

    try {
      await addDoc(TablerosBD, { Nombre: nuevaLista.Nombre, ListaID: nuevaLista.ListaID });
      this.listaTableros.push(nuevaLista);
      this.newListName = '';
      this.isModalVisible = false;
    } catch (error) {
      console.error("Error al agregar la nueva lista: ", error);
    }
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

  generateRandomString(num: number): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < num; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  mostrarModal() {
    this.isModalVisible = true;
  }

  logginout() {
    localStorage.removeItem('UsuarioId');
    this.router.navigate(['/login']);
  }

  goToMain() {
    this.router.navigate(['/main']);
  }
}
