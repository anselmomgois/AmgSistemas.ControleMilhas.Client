import { formatDate } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmEventType, ConfirmationService, MessageService } from 'primeng/api';
import { RetornoGenerico } from 'src/app/shared/interfaces/retorno-generico.interface';
import { Cotacao } from 'src/app/shared/model/cotacao.model';
import { Empresa } from 'src/app/shared/model/empresa.model';
import { Programa } from 'src/app/shared/model/programa.model';
import { CotacaoService } from 'src/app/shared/services/cotacao.service';
import { EmpresaService } from 'src/app/shared/services/empresa.service';
import { ProgramaService } from 'src/app/shared/services/programa.service';
import { UsuarioService } from 'src/app/shared/services/usuario.service';

@Component({
  selector: 'app-cotacao',
  templateUrl: './cotacao.component.html',
  styleUrls: ['./cotacao.component.css'],
  providers: [ConfirmationService, MessageService]
})
export class CotacaoComponent implements OnInit {

  constructor(private cotacaoService: CotacaoService, private usuarioService: UsuarioService,
    private confirmationService: ConfirmationService, private messageService: MessageService,
    private empresaService: EmpresaService, private programaService: ProgramaService) { }

  ngOnInit(): void {

    this.buscarDados();
  }

  public visivel: boolean = false;
  public mensagemVisivel: boolean = false;
  public mensagemErro: string = '';
  public exibirErro: boolean = false;
  public processando: boolean = false;
  public edicaoHabilitada: boolean = true;

  public cotacoes: Cotacao[] = [];
  public programas: Programa[] = [];
  public empresas: Empresa[] = [];
  public cotacao?: Cotacao;

  public formulario: FormGroup = new FormGroup({
    'valor': new FormControl(null, [Validators.required, Validators.minLength(1)]),
    'data': new FormControl(null, [Validators.required]),
    'empresa': new FormControl(null, [Validators.required]),
    'programa': new FormControl(null, [Validators.required])
  })

  cadastrar() {
    try {

      this.habilitarSpiner(true);

      this.cotacao = (this.cotacao == undefined || this.cotacao == null) ?
        new Cotacao('', this.formulario.get('data')!.value, this.formulario.get('valor')!.value,
          new Empresa(this.formulario.get('empresa')!.value.identificador, '', ''),
          new Programa(this.formulario.get('programa')!.value.identificador, '', ''),
          this.usuarioService.recuperarUsuarioLogado().identificador) :
        this.cotacao;

      this.cotacao.data = this.formulario.get('data')!.value;
      this.cotacao.valor = this.formulario.get('valor')!.value;
      this.cotacao.empresa.identificador = this.formulario.get('empresa')!.value.identificador;
      this.cotacao.programa.identificador = this.formulario.get('programa')!.value.identificador;

      console.log(JSON.stringify(this.cotacao))
      this.cotacaoService.cadastrar(this.cotacao)
        .subscribe((resposta: RetornoGenerico) => {
          console.log(resposta);
          if (resposta.codigo === 0) {
            this.habilitarSpiner(false);
            this.formulario.controls['data'].setValue('')
            this.formulario.controls['valor'].setValue('')
            this.formulario.controls['empresa'].setValue('')
            this.formulario.controls['programa'].setValue('')
            this.cotacao = undefined;
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
    this.buscarEmpresas();
  }

  buscarEmpresas() {
    this.empresaService.recuperarProgramas(this.usuarioService.recuperarUsuarioLogado().identificador)
      .subscribe((resposta: RetornoGenerico) => {
        if (resposta.codigo === 0) {
          this.empresas = resposta.retorno
          this.buscarProgramas();
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

  buscarProgramas() {
    this.programaService.recuperarProgramas(this.usuarioService.recuperarUsuarioLogado().identificador)
      .subscribe((resposta: RetornoGenerico) => {
        if (resposta.codigo === 0) {
          this.programas = resposta.retorno
          this.buscarCotacoes();
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

  buscarCotacoes() {

    this.habilitarSpiner(true);

    this.cotacaoService.recuperarProgramas(this.usuarioService.recuperarUsuarioLogado().identificador)
      .subscribe((resposta: RetornoGenerico) => {
        this.habilitarSpiner(false);
        if (resposta.codigo === 0) {
          this.cotacoes = resposta.retorno
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

    this.cotacaoService.recuperarPrograma(id)
      .subscribe((resposta: RetornoGenerico) => {
        this.habilitarSpiner(false);
        if (resposta.codigo === 0) {
          this.cotacao = resposta.retorno;
        
          this.formulario.controls['data'].setValue(new Date(this.cotacao!.data));
          this.formulario.controls['valor'].setValue(this.cotacao!.valor);
          this.formulario.controls['programa'].setValue(this.cotacao!.programa);
          this.formulario.controls['empresa'].setValue(this.cotacao!.empresa);
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
    this.formulario.controls['empresa'].enable();
    this.buscarCotacao(id);
  }

  visualizarPrograma(id: string) {
    this.edicaoHabilitada = false;
    this.formulario.controls['data'].disable();
    this.formulario.controls['valor'].disable();
    this.formulario.controls['programa'].disable();
    this.formulario.controls['empresa'].disable();
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
    this.cotacaoService.deletarPrograma(id)
      .subscribe((resposta: RetornoGenerico) => {
        this.buscarCotacoes();
        this.messageService.add({ severity: 'info', summary: 'Confirmação', detail: 'Registro deletado com sucesso.' });
      },
        (err: HttpErrorResponse) => {
          this.habilitarSpiner(false);
          this.exibirJanelaErro(err.message);
        })

  }
}
