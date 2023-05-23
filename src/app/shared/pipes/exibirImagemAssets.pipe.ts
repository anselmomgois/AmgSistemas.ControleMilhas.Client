import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: 'exibirImagemAssets'
})
export class ExibirImagemAssetsPipe implements PipeTransform {

    transform(valor: string, numeroNiveis: number = 3, extensao: string = 'png'): string {

        let caminho: string = '';

        for (let i = 0; i < numeroNiveis; i++) {
            caminho += '../'
        }

        caminho += 'assets/';

        return caminho + valor + '.' + extensao;
    }
}