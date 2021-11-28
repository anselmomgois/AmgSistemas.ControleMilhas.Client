import { Usuario } from './../classes/usuario.model';
export class Programa {

    constructor(public identificador:string|null,
                public descricao:string,
                public usuario:Usuario){}
}