import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Membro } from '../model/membro.model';
import { Observable } from 'rxjs';
import { RetornoGenerico } from '../interfaces/retorno-generico.interface';

@Injectable({
  providedIn: 'root'
})
export class MembroService {

  private apiUrl: string = 'http://localhost/AmgSistemas.ControleMilhas.Api/membro';

  constructor(private clientHttp: HttpClient) { }

  public cadastrar(membro:Membro): Observable<RetornoGenerico> {

    let headers = new HttpHeaders({
      "Content-Type": "application/json"
    });
    let httpOptions = {
      headers: headers
    };

    return this.clientHttp.post<RetornoGenerico>(this.apiUrl,
      JSON.stringify(membro),
      httpOptions
    )
  }

  recuperarMembros(idUsuario: string):Observable<RetornoGenerico>
  {

    const url =`${this.apiUrl}/buscar-todos/${idUsuario}`;

    return this.clientHttp.get<RetornoGenerico>(url);
  }

  recuperarMembro(id: string):Observable<RetornoGenerico>
  {

    const url =`${this.apiUrl}/recuperar/${id}`;

    return this.clientHttp.get<RetornoGenerico>(url);
  }

  deletarMembro(id: string):Observable<RetornoGenerico>
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
