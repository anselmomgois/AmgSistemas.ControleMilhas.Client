import { Programa } from "../shared/model/programa.model";
import { CotacaoGrid } from "./cotacaoGrid.model";

export class SaldoGrid {

    constructor(public dataModificacao:Date, public nomeMembro:string, public programa:Programa,  public quantidadeMilhas:number,
                public valorMilheiroTotal:number, public valorTotalGasto:number, public valorMilheiroAtual:number, 
                public quantidadeMilhasTotaisCompradas:number, public valorTotalGastoSemVendas:number, public cotacoes?:CotacaoGrid[]){}
}