import { HttpErrorResponse, HttpResponse, HttpResponseBase } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService, ConfirmEventType } from 'primeng/api';
import { RetornoGenerico } from 'src/app/shared/interfaces/retorno-generico.interface';
import { Programa } from 'src/app/shared/model/programa.model';
import { ProgramaService } from 'src/app/shared/services/programa.service';
import { UsuarioService } from 'src/app/shared/services/usuario.service';

@Component({
  selector: 'app-programa',
  templateUrl: './programa.component.html',
  styleUrls: ['./programa.component.css'],
  providers: [ConfirmationService, MessageService]
})
export class ProgramaComponent implements OnInit {

  constructor(private programaService: ProgramaService, private usuarioService: UsuarioService,
              private confirmationService: ConfirmationService, private messageService: MessageService) { }

  ngOnInit(): void {

    this.buscarProgramas();
  }

  public visivel: boolean = false;
  public mensagemVisivel: boolean = false;
  public mensagemErro: string = '';
  public exibirErro: boolean = false;
  public processando: boolean = false;
  public edicaoHabilitada:boolean = true;

  public programas: Programa[] = [];
  public programa!: Programa;

  public formulario: FormGroup = new FormGroup({
    'descricao': new FormControl(null, [Validators.required, Validators.minLength(2)])
  })

  cadastrar() {
    try {

      this.habilitarSpiner(true);

      this.programa = (this.programa == undefined || this.programa == null) ?
        new Programa('', this.formulario.get('descricao')!.value, this.usuarioService.recuperarUsuarioLogado().identificador) :
        this.programa;

      this.programa.descricao = this.formulario.get('descricao')!.value;

      this.programaService.cadastrar(this.programa)
        .subscribe((resposta: RetornoGenerico) => {

          if (resposta.codigo === 0) {
            this.habilitarSpiner(false);
            this.formulario.controls['descricao'].setValue('')
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

    this.programaService.recuperarProgramas(this.usuarioService.recuperarUsuarioLogado().identificador)
      .subscribe((resposta: RetornoGenerico) => {
        this.habilitarSpiner(false);
        if (resposta.codigo === 0) {
          this.programas = resposta.retorno
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

    this.programaService.recuperarPrograma(id)
      .subscribe((resposta: RetornoGenerico) => {
        this.habilitarSpiner(false);
        if (resposta.codigo === 0) {
          this.programa = resposta.retorno;
          console.log(this.programa);
          this.formulario.controls['descricao'].setValue(this.programa.descricao);
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
  this.programaService.deletarPrograma(id)
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
