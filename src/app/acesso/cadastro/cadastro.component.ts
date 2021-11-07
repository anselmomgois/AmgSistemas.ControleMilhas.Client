import { Autenticacao } from './../../services/autenticacao.services';
import { RetornoGenerico } from './../../classes/retornoGenerico.model';
import { Usuario } from './../../classes/usuario.model';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.css']
})
export class CadastroComponent implements OnInit {
  
  constructor(public autenticacao:Autenticacao) { }
  
  public formulario:FormGroup = new FormGroup(
    {
      'nome':new FormControl(null,[Validators.required,Validators.minLength(3), Validators.maxLength(120)]),
      'usuario': new FormControl(null,[Validators.required,Validators.minLength(3), Validators.maxLength(50)]),
      'senha': new FormControl(null,[Validators.required,Validators.minLength(3), Validators.maxLength(50)])
    }
    )
     
    @Output() public exibirLogin:EventEmitter <string> = new EventEmitter()
    ngOnInit(): void {
    }
    
    public EfetuarLogin():void {
      
      this.exibirLogin.emit('login')
    }
    
    public cadastrarUsuario():void {
      
      let usuario:Usuario = new Usuario(null,    
        this.formulario.value.usuario,
        this.formulario.value.nome,  
        this.formulario.value.senha
        )
        this.autenticacao.cadastrarUsuario(usuario).subscribe((retorno:RetornoGenerico) => {
          if(retorno.codigo == 0)
          {
            this.EfetuarLogin()
          }
          else
          {
            console.log(retorno.descricao)
          }          
          
        })
        
      }
    }
    