import { PromocaoLocal } from "../model/PromocaoLocal.model";
import { Promocao } from "../model/promocao.model";
import { CodigoDescricao } from "../model/codigoDescricao.model";

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

    static RetornarTipoBandeiraCartao(): CodigoDescricao[] {

        let tiposBandeiraCartao:CodigoDescricao[] = [];

        tiposBandeiraCartao.push(new CodigoDescricao('MST', 'Mastercard'));
        tiposBandeiraCartao.push(new CodigoDescricao('VIS', 'Visa'));
        tiposBandeiraCartao.push(new CodigoDescricao('AMX', 'American Express'));
        tiposBandeiraCartao.push(new CodigoDescricao('ELO', 'Elo'));

        return tiposBandeiraCartao;
    }
}