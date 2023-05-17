import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrimeNgModule } from '../prime-ng/prime-ng.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MovimentoComponent } from './movimento/movimento.component';
import { SharedModule } from '../shared/shared.module';



@NgModule({
    declarations: [
        MovimentoComponent
    ],
    exports: [
        MovimentoComponent
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
export class OperacaoModule { }
