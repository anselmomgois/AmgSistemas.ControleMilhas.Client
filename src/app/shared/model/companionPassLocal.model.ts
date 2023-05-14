import { CompanionPass } from "./companionPass.model";
import { Membro } from "./membro.model";
import { ProgramaLocal } from "./programaLocal.model";

export class CompanionPassLocal extends CompanionPass {

    override programa:ProgramaLocal;

    constructor(data:Date, quantidadePontos:number, quantidadeTotalNecessaria:number, membro:Membro, programa:ProgramaLocal, descricaoPeriodo:string) {

        super(data,quantidadePontos,quantidadeTotalNecessaria,membro,programa, descricaoPeriodo);

        this.programa = programa;
    }
}