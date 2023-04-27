import { Membro } from "./membro.model";
import { Programa } from "./programa.model";
import { Promocao } from "./promocao.model";

export class Movimento {

    constructor(public identificador:string, public dataMovimento:Date, public dataRecebimento:Date,
                public descricao:string, public valor:number, public valorMilheiro:number,
                public quantidadeMilhas:number,  public quantidadeBonificada:number, public quantidadeTotal:number,
                public quantidadeParcelas:number, public recebido:boolean, public codigoTipo:string, public identificadorUsuario:string,
                public programa:Programa, public membro:Membro, public companionPass:boolean, 
                public promocao?:Promocao){}
}