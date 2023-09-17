import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmEventType, ConfirmationService, MessageService } from 'primeng/api';
import { UsuarioService } from 'src/app/autenticacao/services/usuario.service';
import { RetornoGenerico } from 'src/app/shared/interfaces/retorno-generico.interface';
import { Membro } from 'src/app/shared/model/membro.model';
import { MembroService } from 'src/app/shared/services/membro.service';

@Component({
  selector: 'app-membro',
  templateUrl: './membro.component.html',
  styleUrls: ['./membro.component.css'],
  providers: [ConfirmationService, MessageService]
})
export class MembroComponent  implements OnInit {

  constructor(private membroService: MembroService, private usuarioService: UsuarioService,
    private confirmationService: ConfirmationService, private messageService: MessageService){}

    ngOnInit(): void {

      this.buscarProgramas();
    }

    
    public visivel: boolean = false;
    public mensagemVisivel: boolean = false;
    public mensagemErro: string = '';
    public exibirErro: boolean = false;
    public processando: boolean = false;
    public edicaoHabilitada:boolean = true;
  
    public membros: Membro[] = [];
    public membro?: Membro;
  
    public formulario: FormGroup = new FormGroup({
      'descricao': new FormControl(null, [Validators.required, Validators.minLength(2)])
    })


    cadastrar() {
      try {
  
        this.habilitarSpiner(true);
  
        console.log(this.formulario.get('descricao')!.value);
        this.membro = (this.membro == undefined || this.membro == null) ?
          new Membro('', this.formulario.get('descricao')!.value, this.usuarioService.usuarioCorrente!.identificador) :
          this.membro;
  
        this.membro.nome = this.formulario.get('descricao')!.value;
  
        this.membroService.cadastrar(this.membro)
          .subscribe((resposta: RetornoGenerico) => {
  
            if (resposta.codigo === 0) {
              this.habilitarSpiner(false);
              this.formulario.controls['descricao'].setValue('')
              this.membro = undefined;
              this.visivel = false;
              this.mensagemVisivel = true;
              this.exibirErro = false;
              this.buscarProgramas();
            }
            else {
              this.habilitarSpiner(false);
              this.exibirJanelaErro(resposta.descricao);
            }
          },
            (err: HttpErrorResponse) => {
              this.habilitarSpiner(false);
              this.exibirJanelaErro(err.message);
            })
      }
      catch (e) {
        this.habilitarSpiner(false);
        this.exibirJanelaErro('Erro Geral');
      }
    }
  
    showDialog() {
  
      this.exibirErro = false;
      this.mensagemVisivel = false;
      this.visivel = !this.visivel;
    }
  
    exibirJanelaErro(mensagemErro: string) {
      this.mensagemVisivel = true;
      this.mensagemErro = mensagemErro;
      this.exibirErro = true;
    }
  
    habilitarSpiner(habilitar: boolean) {
      this.processando = habilitar;
    }
  
    buscarProgramas() {
  
      this.habilitarSpiner(true);
  
      this.membroService.recuperarMembros(this.usuarioService.usuarioCorrente!.identificador)
        .subscribe((resposta: RetornoGenerico) => {
          this.habilitarSpiner(false);
          if (resposta.codigo === 0) {
            this.membros = resposta.retorno
          }
          else {
            this.exibirJanelaErro(resposta.descricao);
          }
        },
          (err: HttpErrorResponse) => {
            this.habilitarSpiner(false);
            this.exibirJanelaErro(err.message);
          })
    }
  
    buscarPrograma(id: string) {
  
      this.habilitarSpiner(true);
  
      this.membroService.recuperarMembro(id)
        .subscribe((resposta: RetornoGenerico) => {
          this.habilitarSpiner(false);
          if (resposta.codigo === 0) {
            this.membro = resposta.retorno;
            this.formulario.controls['descricao'].setValue(this.membro!.nome);
            this.showDialog();
          }
          else {
            this.exibirJanelaErro(resposta.descricao);
          }
        },
          (err: HttpErrorResponse) => {
            this.habilitarSpiner(false);
            this.exibirJanelaErro(err.message);
          })
    }
  
    editarPrograma(id: string) {
       this.edicaoHabilitada = true;
       this.formulario.controls['descricao'].enable();
       this.buscarPrograma(id);
    }
  
    visualizarPrograma(id: string) {
      this.edicaoHabilitada = false;
      this.formulario.controls['descricao'].disable();
      this.buscarPrograma(id);
    }
  
    deletar(id:string) {
      this.confirmationService.confirm({
          message: 'Tem certeza que deseja deletar o registro?',
          header: 'Confirmar exclusão',
          icon: 'pi pi-info-circle',
          acceptLabel: 'Sim',
          rejectLabel: 'Não',
          accept: () => {
            this.executarDeletar(id);            
          },
          reject: (type: any) => {
              switch (type) {
                  case ConfirmEventType.REJECT:
                      /**this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected' });**/
                      break;
                  case ConfirmEventType.CANCEL:
                      /**this.messageService.add({ severity: 'warn', summary: 'Cancelled', detail: 'You have cancelled' });**/
                      break;
              }
          }
      });
  }
  
  executarDeletar(id:string)
  {
    this.membroService.deletarMembro(id)
    .subscribe((resposta:RetornoGenerico) => {
      this.buscarProgramas();
      this.messageService.add({ severity: 'info', summary: 'Confirmação', detail: 'Registro deletado com sucesso.' });
    },
    (err: HttpErrorResponse) => {
      this.habilitarSpiner(false);
      this.exibirJanelaErro(err.message);
    })
    
  }
  
}
