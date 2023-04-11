import { Empresa } from "./empresa.model";
import { Programa } from "./programa.model";

export class Cotacao {

    constructor(public identificador:any, public data:Date, public valor:number, 
                public empresa:Empresa, public programa: Programa, public identificadorUsuario:string){}
}