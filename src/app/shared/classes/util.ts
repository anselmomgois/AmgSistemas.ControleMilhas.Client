import { Programa } from "../model/programa.model";
import { ProgramaLocal } from "../model/programaLocal.model";
import { Promocao } from "../model/promocao.model";
import { PromocaoLocal } from "../model/promocaoLocal.model";

export class Util {

    static convertPromocaoToPromocaoLocal(promocao?: Promocao): PromocaoLocal | undefined {

        if (promocao == undefined || promocao == null) return undefined;

        return new PromocaoLocal(promocao!.identificador, promocao!.data, promocao!.valor, this.convertProgramaToProgramaLocal(promocao!.programa),
            promocao!.identificadorUsuario,
            'Promoção ' + promocao!.programa?.descricao + ' - ' +
            promocao!.valor + '%' + ' - ' + new Date(promocao!.data).toLocaleDateString('pt-BR'));
    }

    static convertProgramaToProgramaLocal(programa: Programa): ProgramaLocal {

        if (programa == undefined || programa == null) {
            return new ProgramaLocal('', '', '', '', null, false, '');
        }
        return new ProgramaLocal(programa.identificador, programa.descricao, programa.identificadorUsuario, programa.codigoCor,
            programa.imagem, programa.programaBanco, 'background-color: ' + programa.codigoCor)
    }
}