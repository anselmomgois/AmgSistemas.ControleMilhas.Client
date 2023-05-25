import { RouterModule, Routes } from "@angular/router";
import { LayoutPageComponent } from "./layout-page/layout-page.component";
import { MovimentoComponent } from "./movimento/movimento.component";
import { NgModule } from "@angular/core";

const routes: Routes = [
    {
        path: '',
        component: LayoutPageComponent,
        children: [
            {
                path: 'movimento',
                component: MovimentoComponent
            },
            {
                path:'**',
                redirectTo: 'movimento'
            }
        ]
    }
]

@NgModule({
    imports : [
        RouterModule.forChild(routes)
    ],
    exports:[
        RouterModule
    ]}

)
export class OperacaoRoutingModule {

}