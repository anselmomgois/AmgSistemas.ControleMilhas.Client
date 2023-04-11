import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Cotacao } from '../model/cotacao.model';
import { Observable } from 'rxjs';
import { RetornoGenerico } from '../interfaces/retorno-generico.interface';

@Injectable({
  providedIn: 'root'
})
export class CotacaoService {

  private apiUrl: string = 'http://localhost/AmgSistemas.ControleMilhas.Api/cotacao';

  constructor(private clientHttp: HttpClient) { }

  public cadastrar(cotacao:Cotacao): Observable<RetornoGenerico> {

    let headers = new HttpHeaders({
      "Content-Type": "application/json"
    });
    let httpOptions = {
      headers: headers
    };

    return this.clientHttp.post<RetornoGenerico>(this.apiUrl,
      JSON.stringify(cotacao),
      httpOptions
    )
  }

  recuperarProgramas(idUsuario: string):Observable<RetornoGenerico>
  {

    const url =`${this.apiUrl}/buscar-todos/${idUsuario}`;

    return this.clientHttp.get<RetornoGenerico>(url);
  }

  recuperarPrograma(id: string):Observable<RetornoGenerico>
  {

    const url =`${this.apiUrl}/recuperar/${id}`;

    return this.clientHttp.get<RetornoGenerico>(url);
  }

  deletarPrograma(id: string):Observable<RetornoGenerico>
  {
    let headers = new HttpHeaders({
      "Content-Type": "application/json"
    });
    let httpOptions = {
      headers: headers
    };

    const url =`${this.apiUrl}/deletar/${id}`;

    return this.clientHttp.delete<RetornoGenerico>(url)
  }
}
