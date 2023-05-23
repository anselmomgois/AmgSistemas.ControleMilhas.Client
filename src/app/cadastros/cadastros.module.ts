import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgramaComponent } from './programa/programa.component';
import { PrimeNgModule } from '../prime-ng/prime-ng.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MembroComponent } from './membro/membro.component';
import { EmpresaComponent } from './empresa/empresa.component';
import { CotacaoComponent } from './cotacao/cotacao.component';
import { PromocaoComponent } from './promocao/promocao.component';
import { AeroportoComponent } from './aeroporto/aeroporto.component';
import { SharedModule } from "../shared/shared.module";
import { CartaoCreditoComponent } from './cartao-credito/cartao-credito.component';
import { ProgramaSalaVipComponent } from './programa-sala-vip/programa-sala-vip.component';
import { CompanhiaAereaComponent } from './companhia-aerea/companhia-aerea.component';


@NgModule({
    declarations: [
        ProgramaComponent,
        MembroComponent,
        EmpresaComponent,
        CotacaoComponent,
        PromocaoComponent,
        AeroportoComponent,
        CartaoCreditoComponent,
        ProgramaSalaVipComponent,
        CompanhiaAereaComponent
    ],
    imports: [
        CommonModule,
        PrimeNgModule,
        ReactiveFormsModule,
        FormsModule,
        BrowserAnimationsModule,
        SharedModule
    ]
})
export class CadastrosModule { }
