import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CompanhiaAerea } from '../model/companhiaAerea.model';
import { Observable, retry } from 'rxjs';
import { RetornoGenerico } from '../interfaces/retorno-generico.interface';

@Injectable({
  providedIn: 'root'
})
export class CompanhiaAereaService {

  private apiUrl: string =  `${environment.API}/companhiaAerea`;

  constructor(private clientHttp: HttpClient) { }

  public cadastrar(companhiaAerea:CompanhiaAerea): Observable<RetornoGenerico> {

    let headers = new HttpHeaders({
      "Content-Type": "application/json"
    });
    let httpOptions = {
      headers: headers
    };

    console.log(JSON.stringify({identificador:companhiaAerea.identificador, descricao: companhiaAerea.descricao, imagem: companhiaAerea.imagem}))

    return this.clientHttp.post<RetornoGenerico>(this.apiUrl,
      JSON.stringify({identificador:companhiaAerea.identificador, descricao: companhiaAerea.descricao, imagem: companhiaAerea.imagem}),
      httpOptions
    ).pipe(retry(10))
  }

  recuperarDados():Observable<RetornoGenerico>
  {

    const url =`${this.apiUrl}/buscar-todos`;

    console.log(url);

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
