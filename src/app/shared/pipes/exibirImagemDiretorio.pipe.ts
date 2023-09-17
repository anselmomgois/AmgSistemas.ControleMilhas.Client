import { Pipe, PipeTransform } from "@angular/core";
import { environment } from "src/environments/environment";

@Pipe({
name:'exibirImagemDiretorio'
})
export class ExibirImagemDiretorioPipe implements PipeTransform {

    constructor(){}
    
    transform(identificadorImagem: string):string {
        
        let baseUrl = environment.UrlImageRepository;

        return identificadorImagem != undefined && identificadorImagem != null ? `${baseUrl}/Arquivos/${identificadorImagem}.jpg` : '';
    }
}