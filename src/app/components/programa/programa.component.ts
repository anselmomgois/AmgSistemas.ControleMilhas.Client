import { Autenticacao } from './../../services/autenticacao.services';
import { RetornoGenerico } from './../../classes/retornoGenerico.model';
import { Programa } from './../../models/programa.model';
import { ProgramaServices } from './../../services/programa.services';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-programa',
  templateUrl: './programa.component.html',
  styleUrls: ['./programa.component.css'],
  providers:[ProgramaServices]
})
export class ProgramaComponent implements OnInit {
  
  constructor(public programaService:ProgramaServices,
    public autenticacao:Autenticacao) { }
    
    public formulario: FormGroup = new FormGroup({
      'descricao': new FormControl(null,[Validators.required,Validators.minLength(3), Validators.maxLength(50)])
    })
    
    
    public alturaFormulario:number = 400
    public codigoCss:string = "width: 1000px; height: " + this.alturaFormulario + "px; overflow-y: scroll;"  
    public mensagemErro!: string;
    public exibirFormulario!: boolean;
    public programas!: Programa[];

    ngOnInit(): void {

      this.formulario =  new FormGroup({
        'descricao': new FormControl(null,[Validators.required,Validators.minLength(3), Validators.maxLength(50)])
      })
      this.programaService.recuperar(this.autenticacao.recuperarUsuario().identificador).subscribe((retorno:RetornoGenerico) => {
console.log(retorno)

      })
    }
    
    public adicionar() {
      this.exibirFormulario = true
      this.alturaFormulario = 250
    }
    
    public editar() {
      this.exibirFormulario = true
    }
    
    public cancelar() {
      this.formulario.get('descricao')?.markAsUntouched()
      this.exibirFormulario = false
    }
    public cadastrar():void {
      
      if(this.formulario.status === 'INVALID'){
        
        this.formulario.get('descricao')?.markAsTouched()
      }
      else
      {
        
        let programa:Programa = new Programa(null,  this.formulario.value.descricao, this.autenticacao.recuperarUsuario())
        
        this.programaService.post(programa).subscribe((retorno:RetornoGenerico) => {
          if(retorno.codigo = 0)
          {
            this.formulario.controls['descricao'].setValue('')
          }
          
        })
      }
      
    }
    
  }
  