import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProgramaComponent } from './cadastros/programa/programa.component';
import { PrincipalComponent } from './principal/principal.component';
import { MembroComponent } from './cadastros/membro/membro.component';
import { EmpresaComponent } from './cadastros/empresa/empresa.component';
import { CotacaoComponent } from './cadastros/cotacao/cotacao.component';
import { PromocaoComponent } from './cadastros/promocao/promocao.component';
import { MovimentoComponent } from './operacao/movimento/movimento.component';
import { AeroportoComponent } from './cadastros/aeroporto/aeroporto.component';
import { CartaoCreditoComponent } from './cadastros/cartao-credito/cartao-credito.component';
import { ProgramaSalaVipComponent } from './cadastros/programa-sala-vip/programa-sala-vip.component';
import { CompanhiaAereaComponent } from './cadastros/companhia-aerea/companhia-aerea.component';

const routes: Routes = [
  {
      path: '',
      component: PrincipalComponent,
      pathMatch: 'full'    
  }, 
  {
    path:'operacao',
    loadChildren: () => import('./operacao/operacao.module').then(m => m.OperacaoModule)
  },
  {
    path:'cadastros',
    loadChildren: () => import('./cadastros/cadastros.module').then(m => m.CadastrosModule)
  },
  {
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
