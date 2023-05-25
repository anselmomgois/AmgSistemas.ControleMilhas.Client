import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrimeNgModule } from '../prime-ng/prime-ng.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MovimentoComponent } from './movimento/movimento.component';
import { SharedModule } from '../shared/shared.module';
import { LayoutPageComponent } from './layout-page/layout-page.component';
import { OperacaoRoutingModule } from './operacao-routing.module';



@NgModule({
    declarations: [
        MovimentoComponent,
        LayoutPageComponent
    ],
    exports: [
        MovimentoComponent
    ],
    imports: [
        CommonModule,
        PrimeNgModule,
        OperacaoRoutingModule,
        ReactiveFormsModule,
        FormsModule,
        SharedModule
    ]
})
export class OperacaoModule { }
