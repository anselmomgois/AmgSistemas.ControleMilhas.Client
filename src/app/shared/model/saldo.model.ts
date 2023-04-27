import { Membro } from "./membro.model";
import { Programa } from "./programa.model";

export class Saldo {

    constructor(public identificador:string, public data:Date, public dataModificacao:Date, public valorCompra:number, public valorVenda: number,
               public quantidadeMilhas:number, public quantidadeMilhasVendidas:number, public quantidadeMilhasTotal:number, public programa:Programa, public membro:Membro, 
               public identificadorUsuario:string){}
}