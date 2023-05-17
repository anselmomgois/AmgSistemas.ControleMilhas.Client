import { ConvertToBackgroundColorPipe } from './pipes/convertToBackgroundColor.pipe';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from './menu/menu.component';
import { PrimeNgModule } from '../prime-ng/prime-ng.module';
import { FormsModule } from '@angular/forms';
import { ExibirImagemPipe } from './pipes/ExibirImagem.pipe';



@NgModule({
  declarations: [
    MenuComponent,
    ExibirImagemPipe,
    ConvertToBackgroundColorPipe
  ],
  imports: [
    CommonModule,
    PrimeNgModule,
    FormsModule
  ],
  exports: [
    MenuComponent,
    ExibirImagemPipe,
    ConvertToBackgroundColorPipe
  ]
})
export class SharedModule { }
