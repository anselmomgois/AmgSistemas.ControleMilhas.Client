import { Empresa } from '../shared/model/empresa.model';
import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../shared/services/usuario.service';
import { SaldoService } from '../shared/services/saldo.service';
import { Saldo } from '../shared/model/saldo.model';
import { SaldoLocal } from '../shared/model/saldoLocal.model';
import { RetornoGenerico } from '../shared/interfaces/retorno-generico.interface';
import { HttpErrorResponse } from '@angular/common/http';
import { ProgramaLocal } from '../shared/model/programaLocal.model';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DomSanitizer } from '@angular/platform-browser';
import { CotacaoService } from '../shared/services/cotacao.service';
import { Cotacao } from '../shared/model/cotacao.model';
import { EmpresaService } from '../shared/services/empresa.service';
import { SaldoGrid } from './saldoGrid.model';
import { CotacaoGrid } from './cotacaoGrid.model';
import { CompanionPass } from '../shared/model/companionPass.model';
import { MovimentoService } from '../shared/services/movimento.service';
import { CompanionPassLocal } from '../shared/model/companionPassLocal.model';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.css'],
  providers: [ConfirmationService, MessageService]
})
export class PrincipalComponent implements OnInit {

  constructor(private usuarioService: UsuarioService, private saldoService: SaldoService, private sanitizer: DomSanitizer,
    private cotacaoService: CotacaoService, private empresaService: EmpresaService, private movimentoService: MovimentoService) { }

  public companionsPass: CompanionPass[] = [];
  public companionsPassLocal: CompanionPassLocal[] = [];
  public saldos: Saldo[] = [];
  public saldosGrid: SaldoGrid[] = [];
  public cotacoes: Cotacao[] = [];
  public cotacoesTotais: CotacaoGrid[] = [];
  public empresas: Empresa[] = [];
  public mensagemVisivel: boolean = false;
  public mensagemErro: string = '';
  public exibirErro: boolean = false;
  public processando: boolean = false;
  public cssWidhtGrid: string = '';
  public cssWidhtGridData: string = '';
  public cssWidhtGridMembro: string = '';
  public cssWidhtGridPrograma: string = '';
  public cssWidhtGridSaldo: string = '';
  public cssWidhtGridValorMilTotal: string = '';
  public cssWidhtGridValorMilAtual: string = '';
  public cssWidhtGridValorGasto: string = '';

  public valorTotalSaldo: number = 0;
  public valorTotalMilheiroTotal: number = 0;
  public valorTotalMilheiroAtual: number = 0;
  public valorTotalGasto: number = 0;
  public valorTotalQuantidadeMilhasCompradas: number = 0;
  public valorTotalGastoSemVendas: number = 0;

  ngOnInit(): void {

    this.buscarDados();

  }

  buscarDados() {
    this.habilitarSpiner(true);
    this.usuarioService.logar('anselmo', '123');
    this.recuperarSaldo();
  }
  recuperarSaldo() {

    this.saldoService.recuperarSaldos(this.usuarioService.recuperarUsuarioLogado().identificador)
      .subscribe((resposta: RetornoGenerico) => {
        if (resposta.codigo === 0) {
          this.saldos = resposta.retorno
          this.buscarEmpresas();
        }
        else {
          this.exibirJanelaErro(resposta.descricao);
        }

        this.habilitarSpiner(false);
      },
        (err: HttpErrorResponse) => {
          this.habilitarSpiner(false);
          this.exibirJanelaErro(err.message);
        })
  }

  recuperarCotacoes() {

    this.cotacaoService.recuperarUltimaCotacao(this.usuarioService.recuperarUsuarioLogado().identificador)
      .subscribe((resposta: RetornoGenerico) => {
        if (resposta.codigo === 0) {
          this.cotacoes = resposta.retorno
        }
        else {
          this.exibirJanelaErro(resposta.descricao);
        }

        if (this.saldos != undefined && this.saldos != null) {
          this.saldosGrid = [];

          if (this.empresas != undefined && this.empresas != null) {
            this.cssWidhtGridData = 'width: 10%';
            this.cssWidhtGridMembro = 'width: 20%';
            this.cssWidhtGridPrograma = 'width: 25%';
            this.cssWidhtGridSaldo = 'width: 10%';
            this.cssWidhtGridValorMilTotal = 'width: 10%';
            this.cssWidhtGridValorGasto = 'width: 10%';
            this.cssWidhtGridValorMilAtual = 'width: 10%';
          }
          else {
            this.cssWidhtGridData = 'width: 15%';
            this.cssWidhtGridMembro = 'width: 25%';
            this.cssWidhtGridPrograma = 'width: 30%';
            this.cssWidhtGridSaldo = 'width: 15%';
            this.cssWidhtGridValorMilTotal = 'width: 15%';
            this.cssWidhtGridValorGasto = 'width: 15%';
            this.cssWidhtGridValorMilAtual = 'width: 15%';
          }

          this.saldos.forEach((saldoCorrente, index) => {


            let programaLocal = new ProgramaLocal(saldoCorrente.programa.identificador, saldoCorrente.programa.descricao, '',
              saldoCorrente.programa.codigoCor,
              this.sanitizer.bypassSecurityTrustUrl('data:image/jpg;base64,' + saldoCorrente.programa.imagem), saldoCorrente.programa.programaBanco,
              'background-color: ' + saldoCorrente.programa.codigoCor);

            if (this.empresas != undefined && this.empresas != null) {
              let cotacoesGrid: CotacaoGrid[] = [];
              let comprimento: number = Math.trunc(25 / this.empresas.length);
              this.cssWidhtGrid = 'width:' + comprimento + '%';

              this.empresas.forEach((empresaCorrente, indexEmpresa) => {

                let valorCotacao: number = 0;
                if (this.cotacoes != undefined && this.cotacoes != null) {

                  this.cotacoes.forEach((cotacaoCorrente, indexCotacao) => {

                    if (cotacaoCorrente.programa.identificador == saldoCorrente.programa.identificador &&
                      cotacaoCorrente.empresa.identificador == empresaCorrente.identificador) {
                      valorCotacao = cotacaoCorrente.valor * (saldoCorrente.quantidadeMilhasTotal / 1000);
                    }
                  })
                }

                cotacoesGrid.push(new CotacaoGrid(empresaCorrente.identificador, empresaCorrente.descricao, valorCotacao));

                if (this.cotacoesTotais?.length > 0) {
                  let cotacaoFiltrada = this.cotacoesTotais.find(c => c.identificador === empresaCorrente.identificador);
                  
                  if (cotacaoFiltrada != undefined) {
                    cotacaoFiltrada.valor += valorCotacao;
                  }
                  else {
                    this.cotacoesTotais.push(new CotacaoGrid(empresaCorrente.identificador, empresaCorrente.descricao, valorCotacao));
                  }
                }
                else {
                  this.cotacoesTotais.push(new CotacaoGrid(empresaCorrente.identificador, empresaCorrente.descricao, valorCotacao));
                }
              })

              this.saldosGrid.push(new SaldoGrid(saldoCorrente.dataModificacao, saldoCorrente.membro.nome, programaLocal,
                saldoCorrente.quantidadeMilhasTotal, saldoCorrente.valorCompra / (saldoCorrente.quantidadeMilhas / 1000),
                saldoCorrente.valorCompra - saldoCorrente.valorVenda,
                (saldoCorrente.valorCompra - saldoCorrente.valorVenda) / (saldoCorrente.quantidadeMilhasTotal / 1000), saldoCorrente.quantidadeMilhas,
                saldoCorrente.valorCompra, cotacoesGrid));



            }
            else {

              this.saldosGrid.push(new SaldoGrid(saldoCorrente.dataModificacao, saldoCorrente.membro.nome, programaLocal,
                saldoCorrente.quantidadeMilhasTotal, saldoCorrente.valorCompra / (saldoCorrente.quantidadeMilhas / 1000),
                saldoCorrente.valorCompra - saldoCorrente.valorVenda,
                (saldoCorrente.valorCompra - saldoCorrente.valorVenda) / (saldoCorrente.quantidadeMilhasTotal / 1000), saldoCorrente.quantidadeMilhas,
                saldoCorrente.valorCompra, undefined));
            }
          })

          if (this.saldosGrid?.length > 0) {

            this.valorTotalSaldo = this.saldosGrid.reduce((total, valorcorrente) => {
              return total + valorcorrente.quantidadeMilhas;
            }, 0);


            this.valorTotalGasto = this.saldosGrid.reduce((total, valorcorrente) => {
              return total + valorcorrente.valorTotalGasto;
            }, 0);

            this.valorTotalQuantidadeMilhasCompradas = this.saldosGrid.reduce((total, valorcorrente) => {
              return total + valorcorrente.quantidadeMilhasTotaisCompradas;
            }, 0);

            this.valorTotalGastoSemVendas = this.saldosGrid.reduce((total, valorcorrente) => {
              return total + valorcorrente.valorTotalGastoSemVendas;
            }, 0);

            this.valorTotalMilheiroTotal = this.valorTotalGastoSemVendas / (this.valorTotalQuantidadeMilhasCompradas / 1000);

            this.valorTotalMilheiroAtual = this.valorTotalGasto / (this.valorTotalSaldo / 1000);

          }
        }

        this.buscarCompanionsPass();
      },
        (err: HttpErrorResponse) => {
          this.habilitarSpiner(false);
          this.exibirJanelaErro(err.message);
        })
  }

  buscarEmpresas() {

    this.empresaService.recuperarProgramas(this.usuarioService.recuperarUsuarioLogado().identificador)
      .subscribe((resposta: RetornoGenerico) => {
        this.habilitarSpiner(false);
        if (resposta.codigo === 0) {
          this.empresas = resposta.retorno
          this.recuperarCotacoes();
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

  buscarCompanionsPass() {

    this.movimentoService.buscarCompanionsPass(this.usuarioService.recuperarUsuarioLogado().identificador)
      .subscribe((resposta: RetornoGenerico) => {

        if (resposta.codigo === 0) {
          this.companionsPass = resposta.retorno

          this.companionsPassLocal = [];
          if (this.companionsPass?.length > 0) {
            this.companionsPass.forEach((companionCorrente, index) => {

              this.companionsPassLocal.push(new CompanionPassLocal(companionCorrente.data, companionCorrente.quantidadePontos,
                                            companionCorrente.quantidadeTotalNecessaria, companionCorrente.membro,
                                            new ProgramaLocal(companionCorrente.programa.identificador, companionCorrente.programa.descricao, '',
                                                              companionCorrente.programa.codigoCor,
                                                              this.sanitizer.bypassSecurityTrustUrl('data:image/jpg;base64,' + companionCorrente.programa.imagem), 
                                                              companionCorrente.programa.programaBanco,
                                                              'background-color: ' + companionCorrente.programa.codigoCor),companionCorrente.descricaoPeriodo))

            })
          }
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

  exibirJanelaErro(mensagemErro: string) {
    this.mensagemVisivel = true;
    this.mensagemErro = mensagemErro;
    this.exibirErro = true;
  }

  habilitarSpiner(habilitar: boolean) {
    this.processando = habilitar;
  }


}
