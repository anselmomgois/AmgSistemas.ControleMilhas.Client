import { Usuario } from './../classes/usuario.model';
import { environment } from '../../environments/environment';
import { RetornoGenerico } from '../classes/retornoGenerico.model';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Login } from "../classes/login.model";
import { Router } from '@angular/router';

@Injectable()
export class Autenticacao {
    
    constructor(private httpClient:HttpClient,
        private router:Router){}
        
        private readonly API = `${environment.API}/usuario`
        public usuario!: Usuario;
        
        public autenticar(login:Login):Observable<RetornoGenerico> {
            
            let headers = new HttpHeaders({
                "Content-Type":  "application/json"
            });
            let httpOptions = {
                headers: headers
            };
            
            return this.httpClient.post<RetornoGenerico>(`${this.API}/logar`, 
            JSON.stringify(login), 
            httpOptions
            )
        }   
        
        public ArmezenarLogin(usuario:Usuario):void {        
            
            this.usuario = usuario;
            localStorage.setItem('tokenUsuario', JSON.stringify(this.usuario))
            this.router.navigate(['/home'])
        }   
        
        public autenticado(): boolean {
            
            if(this.usuario === undefined && localStorage.getItem('tokenUsuario') !== null) {

                //let usuario: string = localStorage.getItem('tokenUsuario') !== undefined ? localStorage.getItem('tokenUsuario')
                this.usuario = JSON.parse(JSON.stringify(localStorage.getItem('tokenUsuario')))
                
            }
            
            if(this.usuario === undefined)
            {
                this.router.navigate(['/'])
            }
            
            return (this.usuario !== undefined)
            
        }

        public recuperarUsuario(): Usuario {
            
            if(this.usuario === undefined && localStorage.getItem('tokenUsuario') !== null) {
                this.usuario = JSON.parse(JSON.stringify(localStorage.getItem('tokenUsuario')))
            }
            
            if(this.usuario === undefined)
            {
                this.router.navigate(['/'])
            }
            
            return this.usuario
            
        }
       
        public cadastrarUsuario(usuario:Usuario):Observable<RetornoGenerico> {
            
            let headers = new HttpHeaders({
                "Content-Type":  "application/json"
            });
            let httpOptions = {
                headers: headers
            };
            
            return this.httpClient.post<RetornoGenerico>(this.API, 
            JSON.stringify(usuario), 
            httpOptions
            )
        }   
        
    }