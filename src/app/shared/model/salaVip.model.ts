import { Foto } from "./foto.model";

export class SalaVip {

    constructor(public identificador:string, public descricao:string, public observacaoLocalizacao:string, public identificadorAeroporto:string,
                public fotos:Foto[]){}
}