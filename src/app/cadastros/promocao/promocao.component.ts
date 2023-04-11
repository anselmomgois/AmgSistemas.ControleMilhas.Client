import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmEventType, ConfirmationService, MessageService } from 'primeng/api';
import { RetornoGenerico } from 'src/app/shared/interfaces/retorno-generico.interface';
import { Programa } from 'src/app/shared/model/programa.model';
import { Promocao } from 'src/app/shared/model/promocao.model';
import { ProgramaService } from 'src/app/shared/services/programa.service';
import { PromocaoService } from 'src/app/shared/services/promocao.service';
import { UsuarioService } from 'src/app/shared/services/usuario.service';

@Component({
  selector: 'app-promocao',
  templateUrl: './promocao.component.html',
  styleUrls: ['./promocao.component.css'],
  providers: [ConfirmationService, MessageService]
})
export class PromocaoComponent implements OnInit {

  constructor(private promocaoService: PromocaoService, private usuarioService: UsuarioService,
    private confirmationService: ConfirmationService, private messageService: MessageService,
    private programaService: ProgramaService) { }

  ngOnInit(): void {

    this.buscarDados();
  }

  public visivel: boolean = false;
  public mensagemVisivel: boolean = false;
  public mensagemErro: string = '';
  public exibirErro: boolean = false;
  public processando: boolean = false;
  public edicaoHabilitada: boolean = true;

  public promocoes: Promocao[] = [];
  public programas: Programa[] = [];
  public promocao?: Promocao;

  public formulario: FormGroup = new FormGroup({
    'valor': new FormControl(null, [Validators.required, Validators.minLength(1)]),
    'data': new FormControl(null, [Validators.required]),
    'programa': new FormControl(null, [Validators.required])
  })

  cadastrar() {
    try {

      this.habilitarSpiner(true);

      this.promocao = (this.promocao == undefined || this.promocao == null) ?
        new Promocao('', this.formulario.get('data')!.value, this.formulario.get('valor')!.value,
          new Programa(this.formulario.get('programa')!.value.identificador, '', ''),
          this.usuarioService.recuperarUsuarioLogado().identificador) :
        this.promocao;

      this.promocao.data = this.formulario.get('data')!.value;
      this.promocao.valor = this.formulario.get('valor')!.value;
      this.promocao.programa.identificador = this.formulario.get('programa')!.value.identificador;

      this.promocaoService.cadastrar(this.promocao)
        .subscribe((resposta: RetornoGenerico) => {
          console.log(resposta);
          if (resposta.codigo === 0) {
            this.habilitarSpiner(false);
            this.formulario.controls['data'].setValue('')
            this.formulario.controls['valor'].setValue('')
             this.formulario.controls['programa'].setValue('')
            this.promocao = undefined;
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

  buscarDados() {
    this.buscarProgramas();
  }

 
  buscarProgramas() {
    this.programaService.recuperarProgramas(this.usuarioService.recuperarUsuarioLogado().identificador)
      .subscribe((resposta: RetornoGenerico) => {
        if (resposta.codigo === 0) {
          this.programas = resposta.retorno
          this.buscarPromocoes();
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

  buscarPromocoes() {

    this.habilitarSpiner(true);

    this.promocaoService.recuperarProgramas(this.usuarioService.recuperarUsuarioLogado().identificador)
      .subscribe((resposta: RetornoGenerico) => {
        this.habilitarSpiner(false);
        if (resposta.codigo === 0) {
          this.promocoes = resposta.retorno
          console.log(this.promocoes);
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

  buscarCotacao(id: string) {

    this.habilitarSpiner(true);

    this.promocaoService.recuperarPrograma(id)
      .subscribe((resposta: RetornoGenerico) => {
        this.habilitarSpiner(false);
        if (resposta.codigo === 0) {
          this.promocao = resposta.retorno;
        
          this.formulario.controls['data'].setValue(new Date(this.promocao!.data));
          this.formulario.controls['valor'].setValue(this.promocao!.valor);
          this.formulario.controls['programa'].setValue(this.promocao!.programa);
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
    this.formulario.controls['data'].enable();
    this.formulario.controls['valor'].enable();
    this.formulario.controls['programa'].enable();
    this.buscarCotacao(id);
  }

  visualizarPrograma(id: string) {
    this.edicaoHabilitada = false;
    this.formulario.controls['data'].disable();
    this.formulario.controls['valor'].disable();
    this.formulario.controls['programa'].disable();
    this.buscarCotacao(id);
  }

  deletar(id: string) {
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

  executarDeletar(id: string) {
    this.promocaoService.deletarPrograma(id)
      .subscribe((resposta: RetornoGenerico) => {
        this.buscarPromocoes();
        this.messageService.add({ severity: 'info', summary: 'Confirmação', detail: 'Registro deletado com sucesso.' });
      },
        (err: HttpErrorResponse) => {
          this.habilitarSpiner(false);
          this.exibirJanelaErro(err.message);
        })

  }
}
