import { Observable, map, tap } from 'rxjs';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanMatch, Route, Router, RouterStateSnapshot, UrlSegment } from '@angular/router';
import { UsuarioService } from '../services/usuario.service';

@Injectable({ providedIn: 'root' })
export class PublicGuard implements CanMatch, CanActivate {

    constructor(private usuarioService: UsuarioService, private router: Router) { }

    private checarStatusAutenticacao(): boolean | Observable<boolean> {
        return this.usuarioService.checarUsuarioAutenticado()
            .pipe(
                tap(isAuthenticated => {
                    if (isAuthenticated) {
                        this.router.navigate(['./'])
                    }
                }),
                map(isAuthenticated => !isAuthenticated)
            )
    }

    canMatch(route: Route, segments: UrlSegment[]): Observable<boolean> | boolean {
        return this.checarStatusAutenticacao();
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
        return this.checarStatusAutenticacao();
    }
}