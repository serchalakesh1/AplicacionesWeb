import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Firestore, collection, collectionData, query, addDoc, getDoc, doc, serverTimestamp, orderBy, setDoc, docData} from '@angular/fire/firestore';
import { Listas, Usuario, Tarjeta, Tablero } from '../Clases/clasesSimples';
import { deleteDoc } from "@angular/fire/firestore";


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
  listaTablerostime: Tablero[] = [];
  listaTablerosRecent: Tablero[] = [];
  

  constructor(private firestore: Firestore, private router: Router, private route: ActivatedRoute) {
    this.route.queryParams.subscribe(params => {
      this.tableroId = params['id'];
      this.tableroColor = params['color'];
      this.tableroNombre = params['nombre'];
      console.log('Tablero ID:', this.tableroId);
      console.log('Tablero Color:', this.tableroColor);

      // Cargar los datos del tablero seleccionado
      this.loadBoardData();
    });
}


  ngOnInit() {
    this.loadUserProfile();
    this.loadUserBoardstime();
    this.loadUserBoardsRecent();
  }
  services() {
    this.router.navigate(['/customer_service']);
  }
  
  loadBoardData() {
    const usuarioId = localStorage.getItem('UsuarioId');
    const TablerosBD = collection(this.firestore, `users/${usuarioId}/Tableros/${this.tableroId}/Listas`);

    this.credencial = history.state;

    let q = query(TablerosBD);
    collectionData(q).subscribe((Tablerosnap) => {
      this.listaTableros = [];
      this.tarjetasPorLista = {}; // Reiniciar el diccionario de tarjetas por lista
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

async agregarNuevaLista() {
  if (this.newListName.trim() === '') return;

  const nuevaLista = new Listas();
  nuevaLista.Nombre = this.newListName;
  nuevaLista.ListaID = this.generateRandomString(20);

  const usuarioId = localStorage.getItem('UsuarioId');
  const TablerosBD = collection(this.firestore, `users/${usuarioId}/Tableros/${this.tableroId}/Listas`);

  try {
    const listaDocRef = doc(TablerosBD, nuevaLista.ListaID); // Usar ListaID como nombre del documento
    await setDoc(listaDocRef, { Nombre: nuevaLista.Nombre, ListaID: nuevaLista.ListaID });
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

  gotoperfil() {
    this.router.navigate(['/perfil']);
  }

  isModalVisible2: boolean = false;
  isModalVisible3: boolean = false;
  isModalVisible4: boolean = false;
newCardName: string = '';
newCardDescription: string = '';
selectedListaID: string = '';
selectedCardID: string = '';

mostrarModal2(ListaID: string) {
  this.selectedListaID = ListaID;
  this.isModalVisible2 = true;
}

mostrarModal3(Card: string, ListaID: string) {
  this.selectedCardID = Card;
  this.selectedListaID = ListaID;
  const usuarioId = localStorage.getItem('UsuarioId');

  const cardPath = `users/${usuarioId}/Tableros/${this.tableroId}/Listas/${this.selectedListaID}/Tarjetas/${this.selectedCardID}`;
  const cardDocRef = doc(this.firestore, cardPath);

  docData(cardDocRef).subscribe((data: any) => {
    if (data) {
      this.newCardName = data.Nombre;
      this.newCardDescription = data.Contenido;
    }
  });

  this.isModalVisible4 = true;
}

eliminarlista(ListaID: string) {
  this.selectedListaID = ListaID;
  this.isModalVisible3 = true;
}

cerrarModal() {
  this.isModalVisible2 = false;
  this.isModalVisible3 = false;
  this.isModalVisible4 = false;
  this.isModalVisible = false;
  this.newCardName = '';
  this.newCardDescription = '';
}

cerrarModalAlFondo(event: MouseEvent) {
  const target = event.target as HTMLElement;
  if (target.id === 'custom-modal') {
    this.cerrarModal();
  }
}


agregarTarjeta() {
  if (this.newCardName.trim() === '') return;

  const nuevaTarjeta = new Tarjeta();
  nuevaTarjeta.Nombre = this.newCardName;
  nuevaTarjeta.Contenido = this.newCardDescription;
  nuevaTarjeta.TarjetaID = this.generateRandomString(20);

  const usuarioId = localStorage.getItem('UsuarioId');

  if (this.selectedListaID) {
    const TarjetasBD = collection(this.firestore, `users/${usuarioId}/Tableros/${this.tableroId}/Listas/${this.selectedListaID}/Tarjetas`);

    const tarjetaDocRef = doc(TarjetasBD, nuevaTarjeta.TarjetaID); // Usar TarjetaID como nombre del documento
    setDoc(tarjetaDocRef, {
      Nombre: nuevaTarjeta.Nombre,
      Contenido: nuevaTarjeta.Contenido,
      TarjetaID: nuevaTarjeta.TarjetaID,
    }).then(() => {
      console.log("Card added successfully");
      this.tarjetasPorLista[this.selectedListaID]?.push(nuevaTarjeta); // Actualizar localmente la lista de tarjetas
      this.cerrarModal(); // Cerrar el modal después de agregar la tarjeta
    }).catch((error) => {
      console.error("Error adding card: ", error);
    });
  }
}

editarTarjeta() {
  if (this.newCardName.trim() === '') return;

  const usuarioId = localStorage.getItem('UsuarioId');

  if (this.selectedListaID && this.selectedCardID) {
    const TarjetasBD = collection(this.firestore, `users/${usuarioId}/Tableros/${this.tableroId}/Listas/${this.selectedListaID}/Tarjetas`);

    const tarjetaDocRef = doc(TarjetasBD, this.selectedCardID); // Usar el TarjetaID existente para encontrar el documento
    setDoc(tarjetaDocRef, {
      Nombre: this.newCardName,
      Contenido: this.newCardDescription,
      TarjetaID: this.selectedCardID // Asegurarse de que el ID no cambie
    }, { merge: true }) // Usamos merge para actualizar solo los campos especificados
    .then(() => {
      console.log("Card updated successfully");

      // Actualizar localmente la tarjeta en la lista de tarjetas
      const tarjetaIndex = this.tarjetasPorLista[this.selectedListaID]?.findIndex(t => t.TarjetaID === this.selectedCardID);
      if (tarjetaIndex !== -1 && tarjetaIndex !== undefined) {
        this.tarjetasPorLista[this.selectedListaID][tarjetaIndex].Nombre = this.newCardName;
        this.tarjetasPorLista[this.selectedListaID][tarjetaIndex].Contenido = this.newCardDescription;
      }

      this.cerrarModal(); // Cerrar el modal después de actualizar la tarjeta
    }).catch((error) => {
      console.error("Error updating card: ", error);
    });
  }
}


eliminarTarjeta() {
  const usuarioId = localStorage.getItem('UsuarioId');

  if (this.selectedListaID && this.selectedCardID) {
    // Usamos la función collection para obtener la referencia a la colección de tarjetas
    const tarjetasCollectionRef = collection(this.firestore, `users/${usuarioId}/Tableros/${this.tableroId}/Listas/${this.selectedListaID}/Tarjetas`);
    // Usamos la función doc para obtener la referencia al documento de la tarjeta específica
    const tarjetaDocRef = doc(tarjetasCollectionRef, this.selectedCardID);

    // Eliminamos el documento
    deleteDoc(tarjetaDocRef).then(() => {

      // Actualizar localmente la lista de tarjetas
      this.tarjetasPorLista[this.selectedListaID] = this.tarjetasPorLista[this.selectedListaID]?.filter(t => t.TarjetaID !== this.selectedCardID);

      this.cerrarModal(); // Cerrar el modal después de eliminar la tarjeta
    }).catch((error) => {
      console.error("Error deleting card: ", error);
    });
  }
}



confirmDelete() {
  const usuarioId = localStorage.getItem('UsuarioId');

  // Usamos la función collection para obtener la referencia a la colección
  const listaCollectionRef = collection(this.firestore, `users/${usuarioId}/Tableros/${this.tableroId}/Listas`);
  // Usamos la función doc para obtener la referencia al documento
  const listaDocRef = doc(listaCollectionRef, this.selectedListaID);
  deleteDoc(listaDocRef);
  this.cerrarModal(); // Cerrar el modal después de eliminar la lista 
}


}