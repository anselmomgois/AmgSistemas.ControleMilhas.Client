import { Programa } from "./programa.model";

export class Promocao {

    public descricao:string = 'Promoção ' + this.programa.descricao + ' - ' + this.valor  + '%' + ' - ' + new Date(this.data).toLocaleDateString('pt-BR') ;

    constructor(public identificador:any, public data:Date, public valor:number, 
                public programa: Programa, public identificadorUsuario:string){ }
}