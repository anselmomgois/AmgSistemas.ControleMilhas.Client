import { ProgramaSalaVip } from "./programaSalaVip.model";

export class CartaoCredito {

    constructor(public identificador:string, public codigoBandeira:string, public descricao:string, 
                public imagem:any, public identificadorImagem:string, public programasSalasVip?:ProgramaSalaVip[]){}
}