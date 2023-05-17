import { Programa } from "./programa.model";
import { Promocao } from "./promocao.model";

export class PromocaoLocal extends Promocao {

    override descricao:string;

    constructor(identificador:any, data:Date, valor:number, 
        programa: Programa, identificadorUsuario:string, descricao:string){

            super(identificador,data,valor,programa,identificadorUsuario);

            this.descricao = descricao;

        }
}