import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of, retry } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Usuario } from 'src/app/shared/interfaces/usuario.interface';
import { RetornoGenerico } from 'src/app/shared/interfaces/retorno-generico.interface';
import { Login } from 'src/app/shared/model/login.interface';
import { CONST_USUARIO } from 'src/app/shared/classes/constantes';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private apiUrl: string = `${environment.API}/usuario`;
  
   private usuarioLogado!:Usuario;
  

  constructor(private clientHttp: HttpClient,  private router: Router) { }

  public executarLogin(login:Login): Observable<RetornoGenerico> {

    let headers = new HttpHeaders({
      "Content-Type": "application/json"
    });
    let httpOptions = {
      headers: headers
    };

    return this.clientHttp.post<RetornoGenerico>(`${this.apiUrl}/logar`,
      JSON.stringify(login),
      httpOptions
    ).pipe(retry(10))
  }  

  get usuarioCorrente(): Usuario {    

    if (this.usuarioLogado == undefined) {
      return this.recuperarUsuarioStorage()!;
    }
    
    return structuredClone(this.usuarioLogado);
  }

  recuperarUsuarioStorage(): Usuario | undefined {

    let usuarioStorage = sessionStorage.getItem(CONST_USUARIO);

    if (usuarioStorage) {
      let usuario = JSON.parse(usuarioStorage);
      this.usuarioLogado = structuredClone(usuario);
      
      return usuario;
    }

   this.router.navigate(['./autenticacao/login']);

   return undefined
  }

  public logar(usuario:string, senha:string):void {    


    this.executarLogin(new Login(usuario, senha))
    .subscribe((resposta:RetornoGenerico) => {

        if(resposta.codigo === 0)
        {
          this.usuarioLogado = resposta.retorno;
          sessionStorage.setItem(CONST_USUARIO,JSON.stringify(this.usuarioLogado)); 
          
        }
    });
  }

  checarUsuarioAutenticado(): Observable<boolean> {

    if (!sessionStorage.getItem(CONST_USUARIO)) return of(false);

    return of(true);
  }
}
