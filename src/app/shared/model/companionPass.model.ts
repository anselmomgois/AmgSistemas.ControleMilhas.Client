import { Membro } from "./membro.model";
import { Programa } from "./programa.model";

export class CompanionPass {

    constructor(public data:Date, public quantidadePontos:number, public quantidadeTotalNecessaria:number, public membro:Membro, public programa:Programa,
               public descricaoPeriodo:string) {}
}