import { Autenticacao } from './autenticacao.services';
import { Injectable } from "@angular/core";
import { CanActivate } from "@angular/router";

@Injectable()
export class AutenticacaoGuard implements CanActivate {

    constructor(private autenticacao:Autenticacao){}

    canActivate(): boolean {
        return this.autenticacao.autenticado();
    }

}