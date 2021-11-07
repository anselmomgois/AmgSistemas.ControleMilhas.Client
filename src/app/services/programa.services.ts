import { Programa } from './../models/programa.model';
import { HttpHeaders } from '@angular/common/http';
import { RetornoGenerico } from './../classes/retornoGenerico.model';
import { Observable } from 'rxjs';
import { environment } from './../../environments/environment';
import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ProgramaServices {

    constructor(private httpClient:HttpClient){}

    private readonly API = `${environment.API}/programa`

    public post(programa:Programa):Observable<RetornoGenerico> {
            
        let headers = new HttpHeaders({
            "Content-Type":  "application/json"
        });
        let httpOptions = {
            headers: headers
        };
        
        return this.httpClient.post<RetornoGenerico>(this.API, 
        JSON.stringify(programa), 
        httpOptions
        )
    }   

    public recuperar(idUsuario:string):Observable<RetornoGenerico> {
            
        let headers = new HttpHeaders({
            "Content-Type":  "application/json"
        });
        let httpOptions = {
            headers: headers
        };
        
        return this.httpClient.get<RetornoGenerico>(`${this.API}/recuperar/${idUsuario}`)
    }   
}