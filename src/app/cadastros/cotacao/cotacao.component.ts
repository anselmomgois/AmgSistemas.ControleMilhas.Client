import { formatDate } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ConfirmEventType, ConfirmationService, MessageService } from 'primeng/api';
import { RetornoGenerico } from 'src/app/shared/interfaces/retorno-generico.interface';
import { Cotacao } from 'src/app/shared/model/cotacao.model';
import { CotacaoLocal } from 'src/app/shared/model/cotacaoLocal.model';
import { Empresa } from 'src/app/shared/model/empresa.model';
import { Programa } from 'src/app/shared/model/programa.model';
import { ProgramaLocal } from 'src/app/shared/model/programaLocal.model';
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
    private empresaService: EmpresaService, private programaService: ProgramaService,
    private sanitizer: DomSanitizer) { }

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
  public cotacoesComCss: CotacaoLocal[] = [];
  public programas: Programa[] = [];
  public empresas: Empresa[] = [];
  public cotacao?: Cotacao;
  public programaSelecionado?:Programa;

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
          new Programa(this.formulario.get('programa')!.value.identificador, '', '','','',false),
          this.usuarioService.recuperarUsuarioLogado().identificador) :
        this.cotacao;

      this.cotacao.data = this.formulario.get('data')!.value;
      this.cotacao.valor = this.formulario.get('valor')!.value;
      this.cotacao.empresa.identificador = this.formulario.get('empresa')!.value.identificador;
      this.cotacao.programa.identificador = this.formulario.get('programa')!.value.identificador;

      
      this.cotacaoService.cadastrar(this.cotacao)
        .subscribe((resposta: RetornoGenerico) => {
          console.log(resposta);
          if (resposta.codigo === 0) {
            this.habilitarSpiner(false);
            this.limparFormulario();
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

  limparFormulario() {
    this.formulario.controls['data'].setValue('')
    this.formulario.controls['valor'].setValue('')
    this.formulario.controls['empresa'].setValue('')
    this.formulario.controls['programa'].setValue('')

    this.programaSelecionado = undefined;
    this.cotacao = undefined;
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

          this.programas.forEach((programacorrente, index) => {
           
            if (programacorrente.imagem != undefined && programacorrente.imagem != null) {
              programacorrente.imagem = this.sanitizer.bypassSecurityTrustUrl('data:image/jpg;base64,' + programacorrente.imagem);
            }

          });

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

    this.cotacaoService.recuperarCotacoes(this.usuarioService.recuperarUsuarioLogado().identificador)
      .subscribe((resposta: RetornoGenerico) => {
        this.habilitarSpiner(false);
        if (resposta.codigo === 0) {
          this.cotacoes = resposta.retorno
          this.cotacoesComCss = [];
          this.cotacoes.forEach((cotacaoCorrente, index) => {
           
            let programaFiltrado = this.filtrarPrograma(cotacaoCorrente.programa!.identificador);

            
            this.cotacoesComCss.push(new CotacaoLocal(cotacaoCorrente.identificador, cotacaoCorrente.data,
              cotacaoCorrente.valor, cotacaoCorrente.empresa,
              new ProgramaLocal(programaFiltrado!.identificador, programaFiltrado!.descricao, '', programaFiltrado!.codigoCor,
              programaFiltrado!.imagem,false,
            'background-color: ' +  programaFiltrado!.codigoCor),cotacaoCorrente.identificadorUsuario))

          });
          
          
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
    this.limparFormulario();
    this.cotacaoService.recuperarCotacao(id)
      .subscribe((resposta: RetornoGenerico) => {
        this.habilitarSpiner(false);
        if (resposta.codigo === 0) {
          this.cotacao = resposta.retorno;
        
          this.formulario.controls['data'].setValue(new Date(this.cotacao!.data));
          this.formulario.controls['valor'].setValue(this.cotacao!.valor);
          this.formulario.controls['programa'].setValue(this.cotacao!.programa);
          this.formulario.controls['empresa'].setValue(this.cotacao!.empresa);
        
          this.programaSelecionado = this.filtrarPrograma(this.cotacao!.programa.identificador);      

          this.cotacao!.programa.imagem = this.sanitizer.bypassSecurityTrustUrl('data:image/jpg;base64,' + this.programaSelecionado.imagem);
          
        

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

  filtrarPrograma(identificador:string):Programa {
      return this.programas.find(elem => elem.identificador === identificador)!
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
    this.cotacaoService.deletarCotacao(id)
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
