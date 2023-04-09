import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { CadastrosModule } from './cadastros/cadastros.module';
import { PrincipalComponent } from './principal/principal.component';
import { HttpClientModule } from '@angular/common/http';
import { PrimeNgModule } from './prime-ng/prime-ng.module';

import localPt from '@angular/common/locales/pt-PT';
import { registerLocaleData } from '@angular/common';

registerLocaleData(localPt);

@NgModule({
  declarations: [
    AppComponent,
    PrincipalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    SharedModule,
    CadastrosModule,
    PrimeNgModule
  ],
  providers: [
    {provide: LOCALE_ID, useValue: 'pt-PT'}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
