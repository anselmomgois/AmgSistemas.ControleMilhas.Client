import { Programa } from "./programa.model";

export class Promocao {

    constructor(public identificador:any, public data:Date, public valor:number, 
                public programa: Programa, public identificadorUsuario:string){}
}