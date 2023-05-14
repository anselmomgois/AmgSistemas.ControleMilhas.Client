import { Membro } from "./membro.model";
import { ProgramaLocal } from "./programaLocal.model";
import { Saldo } from "./saldo.model";

export class SaldoLocal extends Saldo {
    override programa: ProgramaLocal;

    constructor(identificador: string, data: Date, dataModificacao: Date, valorCompra: number, valorVenda: number,
        quantidadeMilhas: number, quantidadeMilhasVendidas: number, quantidadeMilhasTotal: number, programa: ProgramaLocal, membro: Membro,
        identificadorUsuario: string) {

        super(identificador, data, dataModificacao, valorCompra, valorVenda, quantidadeMilhas, quantidadeMilhasVendidas, quantidadeMilhasTotal, programa,
            membro, identificadorUsuario);

        this.programa = programa;
    }
}