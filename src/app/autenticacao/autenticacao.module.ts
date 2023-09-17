import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayOutPageComponent } from './pages/lay-out-page/lay-out-page.component';
import { LoginComponent } from './pages/login/login.component';
import { RouterModule } from '@angular/router';
import { autenticacaoRoutes } from './autenticacao-routng.module';
import { PrimeNgModule } from '../prime-ng/prime-ng.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    LayOutPageComponent,
    LoginComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(autenticacaoRoutes),
    PrimeNgModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule
  ]
})
export class AutenticacaoModule { }
