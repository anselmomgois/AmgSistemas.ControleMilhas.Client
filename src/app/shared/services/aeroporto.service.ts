import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { RetornoGenerico } from '../interfaces/retorno-generico.interface';
import { Observable, retry } from 'rxjs';
import { Aeroporto } from '../model/aeroporto.model';

@Injectable({
  providedIn: 'root'
})
export class AeroportoService {

  private apiUrl: string =  `${environment.API}/aeroporto`;

  constructor(private clientHttp: HttpClient) { }

  public cadastrar(aeroporto:Aeroporto): Observable<RetornoGenerico> {

    let headers = new HttpHeaders({
      "Content-Type": "application/json"
    });
    let httpOptions = {
      headers: headers
    };

    return this.clientHttp.post<RetornoGenerico>(this.apiUrl,
      JSON.stringify(aeroporto),
      httpOptions
    ).pipe(retry(10))
  }

  recuperarDados():Observable<RetornoGenerico>
  {

    const url =`${this.apiUrl}/buscar-todos`;

    return this.clientHttp.get<RetornoGenerico>(url).pipe(retry(10));
  }

  recuperar(id: string):Observable<RetornoGenerico>
  {

    const url =`${this.apiUrl}/recuperar/${id}`;

    return this.clientHttp.get<RetornoGenerico>(url).pipe(retry(10));
  }

  deletar(id: string):Observable<RetornoGenerico>
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
