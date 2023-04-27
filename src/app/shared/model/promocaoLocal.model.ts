import { ProgramaLocal } from "./programaLocal.model";
import { Promocao } from "./promocao.model";

export class PromocaoLocal extends Promocao {

    descricao:string;

    constructor(identificador:any, data:Date, valor:number, 
        programa: ProgramaLocal, identificadorUsuario:string, descricao:string){

            super(identificador,data,valor,programa,identificadorUsuario);

            this.descricao = descricao;

        }
}