import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RetornoGenerico } from '../interfaces/retorno-generico.interface';

@Injectable({
  providedIn: 'root'
})
export class SaldoService {

  private apiUrl: string = 'http://localhost/AmgSistemas.ControleMilhas.Api/saldo';

  constructor(private clientHttp: HttpClient) { }


  recuperarSaldo(idMembro: string, idPrograma:string):Observable<RetornoGenerico>
  {

    const url =`${this.apiUrl}/recuperar/${idMembro}/${idPrograma}`;

    return this.clientHttp.get<RetornoGenerico>(url);
  }
}
