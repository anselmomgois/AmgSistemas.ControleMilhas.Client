import { ConvertToBackgroundColorPipe } from './pipes/convertToBackgroundColor.pipe';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from './menu/menu.component';
import { PrimeNgModule } from '../prime-ng/prime-ng.module';
import { FormsModule } from '@angular/forms';
import { ExibirImagemPipe } from './pipes/ExibirImagem.pipe';
import { ExibirImagemAssetsPipe } from './pipes/exibirImagemAssets.pipe';
import { ExibirImagemDiretorioPipe } from './pipes/exibirImagemDiretorio.pipe';



@NgModule({
  declarations: [
    MenuComponent,
    ExibirImagemPipe,
    ConvertToBackgroundColorPipe,
    ExibirImagemAssetsPipe,
    ExibirImagemDiretorioPipe
  ],
  imports: [
    CommonModule,
    PrimeNgModule,
    FormsModule
  ],
  exports: [
    MenuComponent,
    ExibirImagemPipe,
    ConvertToBackgroundColorPipe,
    ExibirImagemAssetsPipe,
    ExibirImagemDiretorioPipe

  ]
})
export class SharedModule { }
