import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ConfirmEventType, ConfirmationService, MessageService } from 'primeng/api';
import { Observable, Subscriber } from 'rxjs';
import { Util } from 'src/app/shared/classes/util';
import { RetornoGenerico } from 'src/app/shared/interfaces/retorno-generico.interface';
import { CartaoCredito } from 'src/app/shared/model/cartaoCredito.model';
import { CodigoDescricao } from 'src/app/shared/model/codigoDescricao.model';
import { ProgramaSalaVip } from 'src/app/shared/model/programaSalaVip.model';
import { CartaoCreditoService } from 'src/app/shared/services/cartaoCredito.service';
import { ProgramaSalaVipService } from 'src/app/shared/services/programa-sala-vip.service';

@Component({
  selector: 'app-cartao-credito',
  templateUrl: './cartao-credito.component.html',
  styleUrls: ['./cartao-credito.component.css'],
  providers: [ConfirmationService, MessageService]
})
export class CartaoCreditoComponent implements OnInit {

  constructor(private cartaoCreditoService: CartaoCreditoService,
    private confirmationService: ConfirmationService, private messageService: MessageService,
    private programaSalaVipService: ProgramaSalaVipService) { }

  ngOnInit(): void {

    this.buscarDados();
    this.tiposBandeiraCartao = Util.RetornarTipoBandeiraCartao();

  }

  public visivel: boolean = false;
  public mensagemVisivel: boolean = false;
  public mensagemErro: string = '';
  public exibirErro: boolean = false;
  public processando: boolean = false;
  public edicaoHabilitada: boolean = true;
  public base64Code!: any;
  public imagemVisivel: boolean = false;
  public cartaoCreditoFiltrado!: CartaoCredito;
  public cartoesCredito: CartaoCredito[] = [];
  public cartaoCredito?: CartaoCredito;
  public tiposBandeiraCartao: CodigoDescricao[] = [];
  public tipoBandeiraCartaoSelecionado?: CodigoDescricao;
  public programasSalasVips: ProgramaSalaVip[] = [];
  public programasSalasVipsSelecionados?: ProgramaSalaVip[] = [];

  public formulario: FormGroup = new FormGroup({
    'descricao': new FormControl(null, [Validators.required, Validators.minLength(5)]),
    'codigoBandeira': new FormControl(null, [Validators.required, Validators.minLength(2)]),
    'programasSalasVips': new FormControl(null),
    'imagem': new FormControl(null)
  })

  exibirImagem(id: string) {

    this.cartaoCreditoFiltrado = this.filtrarCartaoCredito(id);
    this.imagemVisivel = true;
  }

  filtrarCartaoCredito(identificador: string): CartaoCredito {
    return this.cartoesCredito.find(elem => elem.identificador === identificador)!
  }

  filtrarBandeiraCartao(codigo: string): CodigoDescricao {
    return this.tiposBandeiraCartao.find(elem => elem.codigo === codigo)!
  }

  cadastrar() {
    try {

      if (this.formulario.status === 'INVALID') {

        this.formulario.get('descricao')?.markAsTouched();
        this.formulario.get('codigoBandeira')?.markAsTouched();
      }
      else {
        this.habilitarSpiner(true);


        this.cartaoCredito = (this.cartaoCredito == undefined || this.cartaoCredito == null) ?
          new CartaoCredito('', this.formulario.get('codigoBandeira')!.value.codigo, this.formulario.get('descricao')!.value, null, '', this.programasSalasVipsSelecionados) :
          this.cartaoCredito;



        this.cartaoCredito.descricao = this.formulario.get('descricao')!.value;
        this.cartaoCredito.codigoBandeira = this.formulario.get('codigoBandeira')!.value.codigo;

        this.cartaoCredito.imagem = undefined;

        this.cartaoCredito.imagem = this.base64Code;

        this.cartaoCredito.programasSalasVip = this.programasSalasVipsSelecionados;

        this.cartaoCreditoService.cadastrar(this.cartaoCredito)
          .subscribe((resposta: RetornoGenerico) => {

            if (resposta.codigo === 0) {
              this.habilitarSpiner(false);
              this.limparFormulario();
              this.visivel = false;
              this.exibirErro = false;
              this.buscarCartoes();
              this.messageService.add({ severity: 'info', summary: 'Confirmação', detail: 'Cadastro realizado com sucesso.' });

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
    }
    catch (e) {
      this.habilitarSpiner(false);
      this.exibirJanelaErro('Erro Geral');
    }
  }

  limparFormulario() {
    this.formulario.controls['descricao'].setValue('')
    this.formulario.controls['codigoBandeira'].setValue('')
    this.formulario.controls['programasSalasVips'].setValue('')
    this.formulario.controls['imagem'].setValue('')
    this.base64Code = undefined;
    this.cartaoCredito = undefined;
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

    this.habilitarSpiner(true);

    this.buscarProgramasSalasVips();
  }

  buscarProgramasSalasVips(): void {
    this.programaSalaVipService.recuperarDados()
      .subscribe((resposta: RetornoGenerico) => {
        if (resposta.codigo === 0) {
          this.programasSalasVips = resposta.retorno;
          this.buscarCartoes();
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

  buscarCartoes(): void {

    this.cartaoCreditoService.recuperarDados()
      .subscribe((resposta: RetornoGenerico) => {
        this.habilitarSpiner(false);
        if (resposta.codigo === 0) {
          this.cartoesCredito = resposta.retorno;
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

  buscar(id: string) {

    this.habilitarSpiner(true);

    this.cartaoCreditoService.recuperar(id)
      .subscribe((resposta: RetornoGenerico) => {
        this.habilitarSpiner(false);
        if (resposta.codigo === 0) {
          this.limparFormulario();
          this.cartaoCredito = resposta.retorno;
          console.log(this.cartaoCredito);
          this.formulario.controls['descricao'].setValue(this.cartaoCredito!.descricao);

          let bandeiraCartao: CodigoDescricao = this.filtrarBandeiraCartao(this.cartaoCredito!.codigoBandeira);

          this.formulario.controls['codigoBandeira'].setValue(bandeiraCartao);
          this.base64Code = this.cartaoCredito!.imagem;          

          this.programasSalasVipsSelecionados = this.cartaoCredito!.programasSalasVip;
          this.formulario.controls['programasSalasVips'].setValue(this.programasSalasVipsSelecionados);


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

  filtrarProgramaSalaVip(identificador: string): ProgramaSalaVip {
    return this.programasSalasVips.find(elem => elem.identificador === identificador)!
  }

  editar(id: string) {
    this.edicaoHabilitada = true;
    this.formulario.enable();
    this.base64Code = undefined;
    this.buscar(id);
  }

  visualizar(id: string) {
    this.edicaoHabilitada = false;
    this.formulario.disable();
    this.base64Code = undefined;
    this.buscar(id);
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
    this.cartaoCreditoService.deletar(id)
      .subscribe((resposta: RetornoGenerico) => {
        this.buscarCartoes();
        this.messageService.add({ severity: 'info', summary: 'Confirmação', detail: 'Registro deletado com sucesso.' });
      },
        (err: HttpErrorResponse) => {
          this.habilitarSpiner(false);
          this.exibirJanelaErro(err.message);
        })

  }

  public preparaImagemUpload(event: Event): void {
    this.base64Code = undefined;
    const target = event.target as HTMLInputElement;

    const file: File = (target.files as FileList)[0];

    this.convertToBase64(file);
  }


  public convertToBase64(file: File): any {

    const observable = new Observable((subscriber: Subscriber<any>) => {
      this.readFile(file, subscriber);
    })

    observable.subscribe((d) => {
      console.log(d);
      this.base64Code = d.replace('data:image/jpg;base64,', '').replace('data:image/png;base64,', '').replace('data:image/jpeg;base64,', '');
    });
  }

  public readFile(file: File, subscriber: Subscriber<any>) {

    const filereader = new FileReader();

    filereader.readAsDataURL(file);

    filereader.onload = () => {

      subscriber.next(filereader.result);
      subscriber.complete()
    }

    filereader.onerror = () => {

      subscriber.error();
      subscriber.complete();
    }
  }
}
