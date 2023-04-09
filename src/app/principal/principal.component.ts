import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../shared/services/usuario.service';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.css']
})
export class PrincipalComponent implements OnInit {

  constructor(private usuarioService:UsuarioService){}
  
  ngOnInit(): void {
    console.log('passou aqui');
    this.usuarioService.logar('anselmo','123');
  }

}
