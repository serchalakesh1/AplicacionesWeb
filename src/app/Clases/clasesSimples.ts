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

    setData(data: any) {
        this.UsuarioID = data.UsuarioID;
        this.Usuario = data.Usuario
        this.Nombre = data.Nombre
        this.Contrasena = data.Contrasena



    }
}

export class Tablero {
    Nombre: string = "";
    Color: string = "";
    TableroID: string = "";

    constructor() {
    }

    setData(data: any) {
        this.Nombre = data.Nombre;
        this.Color = data.Color;
        this.TableroID = data.TableroID;
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
