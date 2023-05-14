import { ProgramaLocal } from "../shared/model/programaLocal.model";
import { CotacaoGrid } from "./cotacaoGrid.model";

export class SaldoGrid {

    constructor(public dataModificacao:Date, public nomeMembro:string, public programa:ProgramaLocal,  public quantidadeMilhas:number,
                public valorMilheiroTotal:number, public valorTotalGasto:number, public valorMilheiroAtual:number, 
                public quantidadeMilhasTotaisCompradas:number, public valorTotalGastoSemVendas:number, public cotacoes?:CotacaoGrid[]){}
}