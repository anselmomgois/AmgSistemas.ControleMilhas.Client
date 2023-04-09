import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgramaComponent } from './programa/programa.component';
import { PrimeNgModule } from '../prime-ng/prime-ng.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MembroComponent } from './membro/membro.component';
import { EmpresaComponent } from './empresa/empresa.component';


@NgModule({
  declarations: [
    ProgramaComponent,
    MembroComponent,
    EmpresaComponent
  ],
  imports: [
    CommonModule,
    PrimeNgModule,
    ReactiveFormsModule,
    FormsModule,
    BrowserAnimationsModule
  ],
  exports: [
    ProgramaComponent,
    MembroComponent,
    EmpresaComponent
  ]
})
export class CadastrosModule { }
