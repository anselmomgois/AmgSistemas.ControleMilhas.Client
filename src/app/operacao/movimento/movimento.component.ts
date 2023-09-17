import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ConfirmEventType, ConfirmationService, MessageService, TreeNode } from 'primeng/api';
import { Util } from 'src/app/shared/classes/util';
import { RetornoGenerico } from 'src/app/shared/interfaces/retorno-generico.interface';
import { Empresa } from 'src/app/shared/model/empresa.model';
import { Membro } from 'src/app/shared/model/membro.model';
import { Movimento } from 'src/app/shared/model/movimento.model';
import { Programa } from 'src/app/shared/model/programa.model';
import { Promocao } from 'src/app/shared/model/promocao.model';
import { MembroService } from 'src/app/shared/services/membro.service';
import { MovimentoService } from 'src/app/shared/services/movimento.service';
import { ProgramaService } from 'src/app/shared/services/programa.service';
import { PromocaoService } from 'src/app/shared/services/promocao.service';
import { MovimentoGrid } from './movimentoGrid.model';
import { SaldoService } from 'src/app/shared/services/saldo.service';
import { Saldo } from 'src/app/shared/model/saldo.model';
import { PromocaoLocal } from 'src/app/shared/model/PromocaoLocal.model';
import { UsuarioService } from 'src/app/autenticacao/services/usuario.service';

@Component({
  selector: 'app-movimento',
  templateUrl: './movimento.component.html',
  styleUrls: ['./movimento.component.css'],
  providers: [ConfirmationService, MessageService]
})
export class MovimentoComponent implements OnInit {

  constructor(private movimentoService: MovimentoService, private usuarioService: UsuarioService,
    private confirmationService: ConfirmationService, private messageService: MessageService,
    private promocaoService: PromocaoService, private programaService: ProgramaService,
    private membroService: MembroService, private sanitizer: DomSanitizer,
    private saldoService: SaldoService) { }


  ngOnInit(): void {


    this.buscarDados();
    this.configurarColunas();
    this.formulario.controls['valorMilheiro'].disable();
    this.formulario.controls['quantidadeBonificada'].disable();
    this.formulario.controls['quantidadeTotal'].disable();
  }

  public movimentacoesTreeNode: TreeNode[] = [];
  public visivel: boolean = false;
  public mensagemVisivel: boolean = false;
  public mensagemErro: string = '';
  public exibirErro: boolean = false;
  public processando: boolean = false;
  public edicaoHabilitada: boolean = true;
  public detalheMovimentoVisivel: boolean = false;
  public operacaoCredito: boolean = false;

  public movimentacoes: Movimento[] = [];
  public programas: Programa[] = [];
  public empresas: Empresa[] = [];
  public membros: Membro[] = [];
  public promocoes: PromocaoLocal[] = [];
  public promocoesFiltradas: PromocaoLocal[] = [];
  public movimento?: Movimento;
  public programaSelecionado?: Programa;
  public promocaoSelecionado?: PromocaoLocal;
  public membroSelecionado?: Membro;
  public saldo?: Saldo;

  public cols: any[] = [];

  public formulario: FormGroup = new FormGroup({
    'descricao': new FormControl(null, [Validators.required, Validators.minLength(1)]),
    'valor': new FormControl(null),
    'valorMilheiro': new FormControl(null),
    'quantidadeMilhas': new FormControl(null, [Validators.required, Validators.min(1)]),
    'quantidadeBonificada': new FormControl(null),
    'quantidadeTotal': new FormControl(null),
    'quantidadeParcelas': new FormControl(null),
    'dataMovimento': new FormControl(null, [Validators.required]),
    'recebido': new FormControl(null),
    'companionPass': new FormControl(null),
    'credito': new FormControl(null),
    'dataRecebimento': new FormControl(null, [Validators.required]),
    'membro': new FormControl(null, [Validators.required]),
    'promocao': new FormControl(null),
    'programa': new FormControl(null, [Validators.required])
  })

  configurarColunas() {

    this.cols = [
      { field: 'codigoTipo', header: 'Tipo' },
      { field: 'dataMovimento', header: 'Data Mov.' },
      { field: 'dataRecebimento', header: 'Data Rec.' },
      { field: 'descricao', header: 'Descrição' },
      { field: 'identificador', header: 'Identificador' },
      { field: 'nomePrograma', header: 'Descrição Programa' },
      { field: 'nomeMembro', header: 'Membro' },
      { field: 'imagemPrograma', header: 'Imagem Programa' },
      { field: 'nomePromocao', header: 'Promoção' },
      { field: 'valor', header: 'Valor' },
      { field: 'valorMilheiro', header: 'Valor Milh.' },
      { field: 'quantidadeMilhas', header: 'Qtd. Milhas' },
      { field: 'quantidadeBonificada', header: 'Qtd. Bonificada' },
      { field: 'quantidadeTotal', header: 'Qtd. Total' },
      { field: 'recebido', header: 'Recebido' },
      { field: 'codigoTipo', header: 'Tipo' },

    ];
  }

  cadastrar() {
    try {

      

      this.calcularValores();

      if(this.formulario.get('valor')!.value == undefined || this.formulario.get('valor')!.value == '')
      {
        this.formulario.controls['valor'].setValue(0);
      }

      this.habilitarSpiner(true);

      this.movimento = (this.movimento == undefined || this.movimento == null) ?
        new Movimento('', this.formulario.get('dataMovimento')!.value, this.formulario.get('dataRecebimento')!.value,
          this.formulario.get('descricao')!.value, this.formulario.get('valor')!.value, this.formulario.get('valorMilheiro')!.value,
          this.formulario.get('quantidadeMilhas')!.value, this.formulario.get('quantidadeBonificada')!.value,
          this.formulario.get('quantidadeTotal')!.value, this.formulario.get('quantidadeParcelas')!.value,
          this.formulario.get('recebido')!.value, this.formulario.get('credito')!.value == true ? 'C' : 'D',
          this.usuarioService.usuarioCorrente!.identificador,
          new Programa(this.formulario.get('programa')!.value.identificador, '', '', '', null, false,''),
          new Membro(this.formulario.get('membro')!.value.identificador, '', ''), this.formulario.get('companionPass')!.value,
          this.formulario.get('promocao')!.value != undefined &&
            this.formulario.get('promocao')!.value != null ?
            new Promocao(this.formulario.get('promocao')!.value.identificador, new Date(), 0,
              new Programa('', '', '', '', null, false,''), '') : undefined) :
        this.movimento;

      this.movimento.dataMovimento = this.formulario.get('dataMovimento')!.value;
      this.movimento.dataRecebimento = this.formulario.get('dataRecebimento')!.value;
      this.movimento.descricao = this.formulario.get('descricao')!.value;
      this.movimento.valor = this.formulario.get('valor')!.value;
      this.movimento.valorMilheiro = this.formulario.get('valorMilheiro')!.value;
      this.movimento.quantidadeMilhas = this.formulario.get('quantidadeMilhas')!.value;
      this.movimento.quantidadeBonificada = this.formulario.get('quantidadeBonificada')!.value;
      this.movimento.quantidadeTotal = this.formulario.get('quantidadeTotal')!.value;
      this.movimento.quantidadeParcelas = this.formulario.get('quantidadeParcelas')!.value;
      this.movimento.recebido = this.formulario.get('recebido')!.value;
      this.movimento.codigoTipo = this.formulario.get('credito')!.value == true ? 'C' : 'D';
      this.movimento.membro.identificador = this.formulario.get('membro')!.value.identificador;
      this.movimento.programa.identificador = this.formulario.get('programa')!.value.identificador;
      this.movimento.quantidadeParcelas = 1;

      if (this.formulario.get('promocao')!.value != undefined &&
        this.formulario.get('promocao')!.value != null) {
        this.movimento.promocao = new Promocao(this.formulario.get('promocao')!.value.identificador, new Date(), 0,
          new Programa('', '', '', '', null, false,''), '');
      }
      else {
        this.movimento.promocao = undefined;
      }

      this.movimento.companionPass = this.formulario.get('companionPass')!.value;

      console.log(this.movimento);

      this.movimentoService.cadastrar(this.movimento)
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

  filtrarPromocaoPrograma() {

    this.buscarSaldo();

    let programa: Programa = this.formulario.get('programa')!.value;

    if (programa != undefined && this.promocoes != undefined && this.promocoes.length > 0) {
      this.promocoesFiltradas = this.promocoes.filter(elem => elem.programa.identificador === programa.identificador)!
      console.log(this.promocoesFiltradas);
    }
  }

  limparFormulario() {
    this.formulario.controls['dataMovimento'].setValue('');
    this.formulario.controls['dataRecebimento'].setValue('');
    this.formulario.controls['descricao'].setValue('');
    this.formulario.controls['valor'].setValue('');
    this.formulario.controls['valorMilheiro'].setValue('');
    this.formulario.controls['quantidadeMilhas'].setValue('');
    this.formulario.controls['quantidadeBonificada'].setValue('');
    this.formulario.controls['quantidadeTotal'].setValue('');
    this.formulario.controls['quantidadeParcelas'].setValue('');
    this.formulario.controls['recebido'].setValue(false);
    this.formulario.controls['credito'].setValue(false);
    this.formulario.controls['membro'].setValue(undefined);
    this.formulario.controls['programa'].setValue(undefined);
    this.formulario.controls['promocao'].setValue(undefined);
    this.formulario.controls['companionPass'].setValue(false);


    this.programaSelecionado = undefined;
    this.membroSelecionado = undefined;
    this.promocaoSelecionado = undefined;
    this.movimento = undefined;
  }

  showDialog(habilitarComponentes: boolean, credito: boolean) {

    if (habilitarComponentes) {
      this.habilitarComponentes();
      this.limparFormulario();
      this.operacaoCredito = credito;

      if (credito) {
        this.formulario.controls['credito'].setValue(true);
      }

      this.formulario.controls['credito'].disable();
    }

    this.exibirErro = false;
    this.mensagemVisivel = false;
    this.visivel = !this.visivel;
  }

  showDialogDetalheMovimento() {
    this.detalheMovimentoVisivel = true;
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
    this.habilitarSpiner(true);

    this.buscarMembros();
  }

  buscarSaldo() {

    if (!this.operacaoCredito) {
      
      let identificadorMembro = this.formulario.get('membro')?.value.identificador;
      let identificadorPrograma = this.formulario.get('programa')?.value.identificador;

      this.saldoService.recuperarSaldo(identificadorMembro, identificadorPrograma)
        .subscribe((resposta: RetornoGenerico) => {
          if (resposta.codigo === 0) {
            this.saldo = resposta.retorno
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

  }

  buscarMembros() {
    this.membroService.recuperarMembros(this.usuarioService.usuarioCorrente!.identificador)
      .subscribe((resposta: RetornoGenerico) => {
        if (resposta.codigo === 0) {
          this.membros = resposta.retorno
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
    this.programaService.recuperarProgramas(this.usuarioService.usuarioCorrente!.identificador)
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
    this.promocaoService.recuperarProgramas(this.usuarioService.usuarioCorrente!.identificador)
      .subscribe((resposta: RetornoGenerico) => {
        if (resposta.codigo === 0) {
          this.promocoes = Util.convertPromocaoToPromocaoLocal(resposta.retorno);

          this.buscarMovimentos();
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

  buscarMovimentos() {

    this.habilitarSpiner(true);

    this.movimentoService.recuperarMovimentos(this.usuarioService.usuarioCorrente!.identificador)
      .subscribe((resposta: RetornoGenerico) => {
        this.habilitarSpiner(false);
        if (resposta.codigo === 0) {
          this.movimentacoes = resposta.retorno

          this.movimentacoes.forEach((movimentacaoCorrente, index) => {

            let programaFiltrado = this.filtrarPrograma(movimentacaoCorrente.programa!.identificador);
            let membroFiltrado = this.filtrarMembro(movimentacaoCorrente.membro!.identificador);
            let promocaoFiltrada = this.filtrarPromocao(movimentacaoCorrente.promocao?.identificador);

            movimentacaoCorrente.programa = programaFiltrado;
            movimentacaoCorrente.membro = membroFiltrado;
            movimentacaoCorrente.promocao = promocaoFiltrada;

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

  private ConvertMovimentaCoesToTreeNode(movimentacoes: Movimento[]) {
    for (let cont of movimentacoes) {
      this.movimentacoesTreeNode.push(this.convertMovimentoToTreeNode(cont));
    }
  }

  private convertMovimentoToTreeNode(movimento: Movimento): TreeNode {

    let countiesTreeNodes: TreeNode[] = [];

    /*if (movimento !== undefined) {
        for (let c of cont.countries) {
            countriesTreeNodes.push(this.paysToTreeNode(c));
        }
    }*/
    return {
      data: new MovimentoGrid(movimento.identificador, movimento.dataMovimento, movimento.dataRecebimento,
        movimento.descricao, movimento.valor, movimento.valorMilheiro, movimento.quantidadeMilhas,
        movimento.quantidadeBonificada, movimento.quantidadeTotal, movimento.quantidadeParcelas,
        movimento.recebido, movimento.codigoTipo, movimento.identificadorUsuario,
        movimento.programa.descricao, movimento.programa.imagem, movimento.membro.nome,
        movimento.companionPass, movimento.programa.codigoCor, '')
      //children: countriesTreeNodes
    };
  }
  calcularValores() {


    if (this.formulario.get('valor')!.value >= 0 && this.formulario.get('quantidadeMilhas')!.value > 0) {
      let valor = this.formulario.get('valor')!.value;
      let quantidadeMilhas = this.formulario.get('quantidadeMilhas')!.value;
      let promocao: Promocao = this.formulario.get('promocao')!.value;
      let quantidadeBonificda = 0;
      let quantidadeTotal = 0;
      let valorMilheiro = 0;

      if (promocao != undefined) {
        quantidadeBonificda = (quantidadeMilhas * promocao.valor) / 100;
      }
      else {
        quantidadeBonificda = 0;
      }

      quantidadeTotal = quantidadeBonificda + quantidadeMilhas;
      valorMilheiro = valor / (quantidadeTotal / 1000);

      this.formulario.controls['valorMilheiro'].setValue(valorMilheiro);
      this.formulario.controls['quantidadeBonificada'].setValue(quantidadeBonificda);
      this.formulario.controls['quantidadeTotal'].setValue(quantidadeTotal);

    }
  }

  buscarMovimento(id: string) {

    this.habilitarSpiner(true);
    this.limparFormulario();
    this.movimentoService.recuperarMovimento(id)
      .subscribe((resposta: RetornoGenerico) => {
        this.habilitarSpiner(false);
        if (resposta.codigo === 0) {
          this.movimento = resposta.retorno;

          console.log(this.movimento);

          this.formulario.controls['dataMovimento'].setValue(new Date(this.movimento!.dataMovimento));
          this.formulario.controls['dataRecebimento'].setValue(new Date(this.movimento!.dataRecebimento));
          this.formulario.controls['descricao'].setValue(this.movimento!.descricao);
          this.formulario.controls['valor'].setValue(this.movimento!.valor);
          this.formulario.controls['valorMilheiro'].setValue(this.movimento!.valorMilheiro);
          this.formulario.controls['quantidadeMilhas'].setValue(this.movimento!.quantidadeMilhas);
          this.formulario.controls['quantidadeBonificada'].setValue(this.movimento!.quantidadeBonificada);
          this.formulario.controls['quantidadeTotal'].setValue(this.movimento!.quantidadeTotal);
          this.formulario.controls['quantidadeParcelas'].setValue(this.movimento!.quantidadeParcelas);
          this.formulario.controls['recebido'].setValue(this.movimento!.recebido);
          this.formulario.controls['credito'].setValue(this.movimento!.codigoTipo == 'C' ? true : false);
          this.formulario.controls['membro'].setValue(this.movimento!.membro);
          this.formulario.controls['programa'].setValue(this.movimento!.programa);
          this.formulario.controls['companionPass'].setValue(this.movimento!.companionPass);

          this.programaSelecionado = this.filtrarPrograma(this.movimento!.programa.identificador);
          this.membroSelecionado = this.filtrarMembro(this.movimento!.membro.identificador);
          this.promocaoSelecionado = this.filtrarPromocao(this.movimento!.promocao?.identificador);


          this.filtrarPromocaoPrograma();
          this.formulario.controls['promocao'].setValue(this.movimento!.promocao);

          this.calcularValores();
          this.operacaoCredito = this.movimento!.codigoTipo == 'C' ? true : false
          this.showDialog(false, false);
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

  filtrarPrograma(identificador: string): Programa {
    return this.programas.find(elem => elem.identificador === identificador)!
  }

  filtrarMembro(identificador: string): Membro {
    return this.membros.find(elem => elem.identificador === identificador)!
  }

  filtrarPromocao(identificador: string): Promocao {

    return this.promocoes.find(elem => elem.identificador === identificador)!
  }

  habilitarComponentes() {

    this.formulario.controls['dataMovimento'].enable();
    this.formulario.controls['dataRecebimento'].enable();
    this.formulario.controls['descricao'].enable();
    this.formulario.controls['valor'].enable();
    this.formulario.controls['quantidadeMilhas'].enable();
    this.formulario.controls['quantidadeParcelas'].enable();
    this.formulario.controls['recebido'].enable();
    this.formulario.controls['credito'].enable();
    this.formulario.controls['membro'].enable();
    this.formulario.controls['programa'].enable();
    this.formulario.controls['promocao'].enable();
    this.formulario.controls['companionPass'].enable();

  }

  editarPrograma(id: string) {
    this.edicaoHabilitada = true;

    this.habilitarComponentes();

    this.buscarMovimento(id);
  }

  visualizarPrograma(id: string) {
    this.edicaoHabilitada = false;
    this.formulario.controls['dataMovimento'].disable();
    this.formulario.controls['dataRecebimento'].disable();
    this.formulario.controls['descricao'].disable();
    this.formulario.controls['valor'].disable();
    this.formulario.controls['quantidadeMilhas'].disable();
    this.formulario.controls['quantidadeParcelas'].disable();
    this.formulario.controls['recebido'].disable();
    this.formulario.controls['credito'].disable();
    this.formulario.controls['membro'].disable();
    this.formulario.controls['programa'].disable();
    this.formulario.controls['promocao'].disable();
    this.formulario.controls['companionPass'].disable();
    this.buscarMovimento(id);
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
    this.movimentoService.deletarMovimento(id)
      .subscribe((resposta: RetornoGenerico) => {
        this.buscarMovimentos();
        this.messageService.add({ severity: 'info', summary: 'Confirmação', detail: 'Registro deletado com sucesso.' });
      },
        (err: HttpErrorResponse) => {
          this.habilitarSpiner(false);
          this.exibirJanelaErro(err.message);
        })

  }

}
