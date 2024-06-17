export class Contacto{
    constructor(){


    }

    Nombre: string="";
    Apellidos: string="";
    Telefono:string="";
    Pais: string="";
}

export class Usuario{

    constructor(){


    }

    UsuarioID="";
    Usuario="";
    Nombre="";
    Contrasena="";

    setData(data:any){
        this.UsuarioID=data.UsuarioID;
        this.Usuario=data.Usuario
        this.Nombre=data.Nombre
        this.Contrasena=data.Contrasena



    }
}
export class elemento{
    constructor(){

    }

    elementoId: string=""
    nombreElemento: string ="";
    unidadMedida: string="";
    descripcion: string="";
    cantidad: number =0;
    usuarioCreacion: string="";
    usuarioUltEdicion: string="";
    
    setData(data:any){

        this.elementoId=data.elementoId
        this.nombreElemento=data.nombreElemento
        this.unidadMedida=data.unidadMedida
        this.descripcion=data.descripcion
        this.cantidad=data.cantidad
        this.usuarioCreacion=data.usuarioCreacion
        this.usuarioUltEdicion=data.usuarioUltEdicion
    }

}