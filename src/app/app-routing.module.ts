import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProgramaComponent } from './cadastros/programa/programa.component';
import { PrincipalComponent } from './principal/principal.component';
import { MembroComponent } from './cadastros/membro/membro.component';
import { EmpresaComponent } from './cadastros/empresa/empresa.component';

const routes: Routes = [
  {
      path: '',
      component: PrincipalComponent,
      pathMatch: 'full'    
  },
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
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
