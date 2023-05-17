import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
name:'convertToBackgroundColor'
})
export class ConvertToBackgroundColorPipe implements PipeTransform {

    
    
    transform(valor: string):string {
        
    
        return valor != undefined && valor != null ? 'background-color: ' + valor  : 'background-color: white' ;
    }
}