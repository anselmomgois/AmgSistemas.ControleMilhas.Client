import { Membro } from "./membro.model";
import { Movimento } from "./movimento.model";
import { ProgramaLocal } from "./programaLocal.model";
import { Promocao } from "./promocao.model";
import { PromocaoLocal } from "./promocaoLocal.model";

export class MovimentoLocal extends Movimento {

   override promocao?:PromocaoLocal;
   override programa:ProgramaLocal;

    constructor(identificador:string, dataMovimento:Date, dataRecebimento:Date,
         descricao:string,  valor:number,  valorMilheiro:number,
         quantidadeMilhas:number,   quantidadeBonificada:number,  quantidadeTotal:number,
         quantidadeParcelas:number,  recebido:boolean,  codigoTipo:string, identificadorUsuario:string,
         programa:ProgramaLocal,  membro:Membro,  companionPass:boolean, promocao?:PromocaoLocal){

            super(identificador, dataMovimento, dataRecebimento, descricao,valor, valorMilheiro, quantidadeMilhas, quantidadeBonificada, quantidadeTotal,
                  quantidadeParcelas, recebido, codigoTipo, identificadorUsuario, programa, membro, companionPass);

                this.promocao = promocao;
                this.programa = programa;
         }
}