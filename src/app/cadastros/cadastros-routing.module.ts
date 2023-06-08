import { RouterModule, Routes } from "@angular/router";
import { LayoutPageComponent } from "./layout-page/layout-page.component";
import { NgModule } from "@angular/core";
import { ProgramaComponent } from "./programa/programa.component";
import { MembroComponent } from "./membro/membro.component";
import { EmpresaComponent } from "./empresa/empresa.component";
import { CotacaoComponent } from "./cotacao/cotacao.component";
import { PromocaoComponent } from "./promocao/promocao.component";
import { AeroportoComponent } from "./aeroporto/aeroporto.component";
import { CartaoCreditoComponent } from "./cartao-credito/cartao-credito.component";
import { ProgramaSalaVipComponent } from "./programa-sala-vip/programa-sala-vip.component";
import { CompanhiaAereaComponent } from "./companhia-aerea/companhia-aerea.component";
import { SalaVipComponent } from "./sala-vip/sala-vip.component";

const routes: Routes = [
    {
        path: '',
        component: LayoutPageComponent,
        children: [
            {
                path: 'programa',
                component: ProgramaComponent,
                pathMatch: 'full'
            },
            {
                path: 'membro',
                component: MembroComponent,
                pathMatch: 'full'
            },
            {
                path: 'empresa',
                component: EmpresaComponent,
                pathMatch: 'full'
            },
            {
                path: 'cotacao',
                component: CotacaoComponent,
                pathMatch: 'full'
            },
            {
                path: 'promocao',
                component: PromocaoComponent,
                pathMatch: 'full'
            },
            {
                path: 'aeroporto',
                component: AeroportoComponent,
                pathMatch: 'full'
            },
            {
                path: 'cartaocredito',
                component: CartaoCreditoComponent,
                pathMatch: 'full'
            },
            {
                path: 'programasalavip',
                component: ProgramaSalaVipComponent,
                pathMatch: 'full'
            },
            {
                path: 'companhiaaerea',
                component: CompanhiaAereaComponent,
                pathMatch: 'full'
            },
            {
                path: 'salavip',
                component: SalaVipComponent,
                pathMatch: 'full'
            },
            {
                path: '**',
                redirectTo: 'principal'
            }
        ]
    }
]

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [
        RouterModule
    ]
}

)
export class CadastrosRoutingModule {

}