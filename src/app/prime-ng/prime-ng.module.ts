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
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { InputNumberModule } from 'primeng/inputnumber';
import { CheckboxModule } from 'primeng/checkbox';
import { ColorPickerModule } from 'primeng/colorpicker';
import { TreeTableModule } from 'primeng/treetable';
import { MultiSelectModule } from 'primeng/multiselect';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { PanelModule } from 'primeng/panel';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { FileUploadModule } from 'primeng/fileupload';
import { GalleriaModule } from 'primeng/galleria';
import { CarouselModule } from 'primeng/carousel';
import { TagModule } from 'primeng/tag';

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
    ToastModule,
    DropdownModule,
    CalendarModule,
    InputNumberModule,
    CheckboxModule,
    ColorPickerModule,
    TreeTableModule,
    MultiSelectModule,
    InputTextareaModule,
    PanelModule,
    ScrollPanelModule,
    FileUploadModule,
    GalleriaModule,
    CarouselModule,
    TagModule    
  ]
})
export class PrimeNgModule { }
