export class Contacto {
    constructor() {


    }

    Nombre: string = "";
    Apellidos: string = "";
    Telefono: string = "";
    Pais: string = "";
}

export class Usuario {

    constructor() {


    }

    UsuarioID = "";
    Usuario = "";
    Nombre = "";
    Contrasena = "";
    Perfil = "https://cdn-icons-png.flaticon.com/512/8345/8345328.png";

    setData(data: any) {
        this.UsuarioID = data.UsuarioID;
        this.Usuario = data.Usuario;
        this.Nombre = data.Nombre;
        this.Contrasena = data.Contrasena;



    }
}

export class Tablero {
    Nombre: string = "";
    Color: string = "";
    TableroID: string = "";
    Timestamp: any = null; // Firebase Timestamp
    recentOpen: any = null; // To track the last time the board was opened

    constructor() {}

    setData(data: any) {
        this.Nombre = data.Nombre;
        this.Color = data.Color;
        this.TableroID = data.TableroID;
        this.Timestamp = data.Timestamp;
        this.recentOpen = data.recentOpen;
    }
}




export class Listas {
    Nombre: string = "";
    ListaID: string = "";

    constructor() {
    }

    setData(data: any) {
        this.Nombre = data.Nombre;
        this.ListaID = data.ListaID;
    }
}

export class Tarjeta {
    Nombre: string = "";
    TarjetaID: string = "";
    Contenido: string = "";

    constructor() {
    }

    setData(data: any) {
        this.Nombre = data.Nombre;
        this.TarjetaID = data.TarjetaID;
        this.Contenido = data.Contenido;
    }
}
