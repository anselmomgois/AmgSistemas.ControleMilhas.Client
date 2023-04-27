export class MovimentoGrid {

    constructor(public identificador:string, public dataMovimento:Date, public dataRecebimento:Date,
        public descricao:string,  public valor:number,  public valorMilheiro:number,
        public quantidadeMilhas:number,   public quantidadeBonificada:number,  public quantidadeTotal:number,
        public quantidadeParcelas:number,  public recebido:boolean,  public codigoTipo:string, public identificadorUsuario:string,
        public nomePrograma:string, public imagemPrograma:any, public  nomeMembro:string, 
        public  companionPass:boolean, public cssCor:string, public nomePromocao?:string){}
}