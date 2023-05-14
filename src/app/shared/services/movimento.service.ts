import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Movimento } from '../model/movimento.model';
import { RetornoGenerico } from '../interfaces/retorno-generico.interface';
import { Observable, retry } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MovimentoService {

  private apiUrl: string = `${environment.API}/movimento`;

  constructor(private clientHttp: HttpClient) { }

  public cadastrar(movimento:Movimento): Observable<RetornoGenerico> {

    let headers = new HttpHeaders({
      "Content-Type": "application/json"
    });
    let httpOptions = {
      headers: headers
    };

    return this.clientHttp.post<RetornoGenerico>(this.apiUrl,
      JSON.stringify(movimento),
      httpOptions
    ).pipe(retry(10))
  }

  recuperarMovimentos(idUsuario: string):Observable<RetornoGenerico>
  {

    const url =`${this.apiUrl}/buscar-todos/${idUsuario}`;

    return this.clientHttp.get<RetornoGenerico>(url).pipe(retry(10));
  }

  buscarCompanionsPass(idUsuario: string):Observable<RetornoGenerico>
  {

    const url =`${this.apiUrl}/buscar-companionpass/${idUsuario}`;

    return this.clientHttp.get<RetornoGenerico>(url).pipe(retry(10));
  }


  recuperarMovimento(id: string):Observable<RetornoGenerico>
  {

    const url =`${this.apiUrl}/recuperar/${id}`;

    return this.clientHttp.get<RetornoGenerico>(url).pipe(retry(10));
  }

  deletarMovimento(id: string):Observable<RetornoGenerico>
  {
    let headers = new HttpHeaders({
      "Content-Type": "application/json"
    });
    let httpOptions = {
      headers: headers
    };

    const url =`${this.apiUrl}/deletar/${id}`;

    return this.clientHttp.delete<RetornoGenerico>(url).pipe(retry(10))
  }
}
