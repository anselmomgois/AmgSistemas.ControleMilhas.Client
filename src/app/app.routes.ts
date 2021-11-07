import { ProgramaComponent } from './components/programa/programa.component';
import { AutenticacaoGuard } from './services/autenticacao-guard.service';
import { AcessoComponent } from './acesso/acesso.component';
import { HomeComponent } from './home/home.component';
import { Routes } from '@angular/router';
export const ROUTES:Routes =[
    { path: '', component: AcessoComponent},
    {path:'home', component: HomeComponent,canActivate:[AutenticacaoGuard]},
    { path: 'programa', component: ProgramaComponent,canActivate:[AutenticacaoGuard]}
]