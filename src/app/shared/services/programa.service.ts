import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RetornoGenerico } from '../interfaces/retorno-generico.interface';
import { Observable, retry } from 'rxjs';
import { Programa } from '../model/programa.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProgramaService {

  private apiUrl: string = `${environment.API}/programa`;

  constructor(private clientHttp: HttpClient) { }

  public cadastrar(programa:Programa): Observable<RetornoGenerico> {

    let headers = new HttpHeaders({
      "Content-Type": "application/json"
    });
    let httpOptions = {
      headers: headers
    };

    return this.clientHttp.post<RetornoGenerico>(this.apiUrl,
      JSON.stringify(programa),
      httpOptions
    ).pipe(retry(10))
  }

  recuperarProgramas(idUsuario: string):Observable<RetornoGenerico>
  {

    const url =`${this.apiUrl}/buscar-todos/${idUsuario}`;

    return this.clientHttp.get<RetornoGenerico>(url).pipe(retry(10));
  }

  recuperarPrograma(id: string):Observable<RetornoGenerico>
  {

    const url =`${this.apiUrl}/recuperar/${id}`;

    return this.clientHttp.get<RetornoGenerico>(url).pipe(retry(10));
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

    return this.clientHttp.delete<RetornoGenerico>(url).pipe(retry(10))
  }

}
