import { Empresa } from "./empresa.model";
import { ProgramaLocal } from "./programaLocal.model";

export class CotacaoLocal {

    constructor(public identificador:any, public data:Date, public valor:number, 
        public empresa:Empresa, public programa: ProgramaLocal, public identificadorUsuario:string){}
}