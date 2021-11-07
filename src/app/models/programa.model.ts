import { Usuario } from './../classes/usuario.model';
export class Programa {

    constructor(public identificador:string,
                public descricao:string,
                public usuario:Usuario){}
}