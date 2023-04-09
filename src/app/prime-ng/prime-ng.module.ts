import { NgModule } from '@angular/core';
import {MenubarModule} from 'primeng/menubar';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';

@NgModule({
  declarations: [],
  exports: [
    MenubarModule,
    InputTextModule,
    ButtonModule,
    TableModule,
    ToolbarModule,
    DialogModule,
    DividerModule,
    ProgressSpinnerModule,
    ConfirmDialogModule,
    ToastModule
  ]
})
export class PrimeNgModule { }
