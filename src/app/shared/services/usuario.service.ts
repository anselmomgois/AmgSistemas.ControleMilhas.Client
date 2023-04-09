import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Usuario } from '../interfaces/usuario.interface';
import { Observable } from 'rxjs';
import { Login } from '../model/login.interface';
import { RetornoGenerico } from '../interfaces/retorno-generico.interface';
import { CONST_USUARIO } from '../classes/constantes';
import { Programa } from '../model/programa.model';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private apiUrl: string = 'http://localhost/AmgSistemas.ControleMilhas.Api/usuario';
  
   private usuarioLogado!:Usuario;
  

  constructor(private clientHttp: HttpClient) { }

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
    )
  }  

  public logar(usuario:string, senha:string):void {    


    this.executarLogin(new Login(usuario, senha))
    .subscribe((resposta:RetornoGenerico) => {

        if(resposta.codigo === 0)
        {
          this.usuarioLogado = resposta.retorno;
          localStorage.setItem(CONST_USUARIO,JSON.stringify(this.usuarioLogado));    
        }
    });
  }

  public recuperarUsuarioLogado():Usuario {

    if(this.usuarioLogado == undefined || this.usuarioLogado == null)
    {
       this.usuarioLogado = JSON.parse(localStorage.getItem(CONST_USUARIO)!);
    }

    return this.usuarioLogado
  }
}
