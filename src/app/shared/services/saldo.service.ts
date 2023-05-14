import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, retry } from 'rxjs';
import { RetornoGenerico } from '../interfaces/retorno-generico.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SaldoService {

  private apiUrl: string = `${environment.API}/saldo`;

  constructor(private clientHttp: HttpClient) { }


  recuperarSaldo(idMembro: string, idPrograma:string):Observable<RetornoGenerico>
  {

    const url =`${this.apiUrl}/recuperar/${idMembro}/${idPrograma}`;

    return this.clientHttp.get<RetornoGenerico>(url).pipe(retry(10));
  }

  recuperarSaldos(idUsuario: string):Observable<RetornoGenerico>
  {

    const url =`${this.apiUrl}/buscar-todos/${idUsuario}`;

    return this.clientHttp.get<RetornoGenerico>(url).pipe(retry(10));
  }
}
