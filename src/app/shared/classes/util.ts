import { PromocaoLocal } from "../model/PromocaoLocal.model";
import { Promocao } from "../model/promocao.model";

export class Util {

    static convertPromocaoToPromocaoLocal(promocoes?: Promocao[]): PromocaoLocal[]  {

        let promocoesRetorno : PromocaoLocal[] = [];

        if (promocoes == undefined || promocoes == null) return promocoesRetorno;        

        promocoes.forEach((promocao, index) => {

            promocoesRetorno.push(new PromocaoLocal(promocao!.identificador, promocao!.data, promocao!.valor, promocao!.programa,
                promocao!.identificadorUsuario,
                'Promoção ' + promocao!.programa?.descricao + ' - ' +
                promocao!.valor + '%' + ' - ' + new Date(promocao!.data).toLocaleDateString('pt-BR')));

        });

        return promocoesRetorno;
    }
}