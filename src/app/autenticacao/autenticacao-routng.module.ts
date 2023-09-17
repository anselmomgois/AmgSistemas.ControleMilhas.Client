import { Routes } from "@angular/router";
import { LayOutPageComponent } from "./pages/lay-out-page/lay-out-page.component";
import { LoginComponent } from "./pages/login/login.component";

export const autenticacaoRoutes: Routes = [
    {
      path: '',
      component: LayOutPageComponent,
      children: [  
        {
            path: 'login',
            component: LoginComponent
        },
        {
          path: '**',
          redirectTo:'login'
        }
      ]
    }
  ];