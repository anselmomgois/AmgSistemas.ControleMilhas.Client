import { Pipe, PipeTransform } from "@angular/core";
import { DomSanitizer, SafeUrl } from "@angular/platform-browser";

@Pipe({
name:'exibirImagem'
})
export class ExibirImagemPipe implements PipeTransform {

    constructor( private sanitizer: DomSanitizer){}
    
    transform(valor: any):SafeUrl {
        
    
        return valor != undefined && valor != null ? this.sanitizer.bypassSecurityTrustUrl('data:image/jpg;base64,' + valor) : '';
    }
}