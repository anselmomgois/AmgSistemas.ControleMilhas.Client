import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Promocao } from '../model/promocao.model';
import { Observable } from 'rxjs';
import { RetornoGenerico } from '../interfaces/retorno-generico.interface';

@Injectable({
  providedIn: 'root'
})
export class PromocaoService {

  private apiUrl: string = 'http://localhost/AmgSistemas.ControleMilhas.Api/promocao';

  constructor(private clientHttp: HttpClient) { }

  public cadastrar(promocao:Promocao): Observable<RetornoGenerico> {

    let headers = new HttpHeaders({
      "Content-Type": "application/json"
    });
    let httpOptions = {
      headers: headers
    };

    return this.clientHttp.post<RetornoGenerico>(this.apiUrl,
      JSON.stringify(promocao),
      httpOptions
    )
  }

  recuperarProgramas(idUsuario: string):Observable<RetornoGenerico>
  {
console.log('passou aqui')
    const url =`${this.apiUrl}/buscar-todos/${idUsuario}`;
    console.log(url)
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
