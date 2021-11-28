import { RetornoGenerico } from './../../classes/retornoGenerico.model';
import { Usuario } from './../../classes/usuario.model';
import { Autenticacao } from '../../services/autenticacao.services';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Login } from 'src/app/classes/login.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  
  public formulario: FormGroup = new FormGroup({
    'usuario': new FormControl(null),
    'senha': new FormControl(null)
  })
  public mensagemErro:string | undefined

  constructor(private autenticacao:Autenticacao) { }
  
  @Output() public exibirPainel:EventEmitter<string> = new EventEmitter()
  
  ngOnInit(): void {
  }
  
  public EfetuarCadastro():void {
    this.exibirPainel.emit('cadastro')
  }
  
  public autenticar():void {
    
    let login:Login = new Login(this.formulario.value.usuario,  this.formulario.value.senha)
    this.autenticacao.autenticar(login).subscribe((retorno:RetornoGenerico) => {
      if(retorno.retorno != undefined && retorno.retorno != null)
      {
        this.autenticacao.ArmezenarLogin(retorno.retorno)
      }
      else
      {
        this.mensagemErro = 'Usuário ou senha incorreta.'
      }
      
    })
  }
  
}
