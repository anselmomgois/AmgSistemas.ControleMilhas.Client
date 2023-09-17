import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmEventType, ConfirmationService, MessageService } from 'primeng/api';
import { RetornoGenerico } from 'src/app/shared/interfaces/retorno-generico.interface';
import { CompanhiaAerea } from 'src/app/shared/model/companhiaAerea.model';
import { CompanhiaAereaService } from 'src/app/shared/services/companhia-aerea.service';
import { Observable, Subscriber } from 'rxjs';

@Component({
  selector: 'app-companhia-aerea',
  templateUrl: './companhia-aerea.component.html',
  styleUrls: ['./companhia-aerea.component.css'],
  providers: [ConfirmationService, MessageService]
})
export class CompanhiaAereaComponent {

  constructor(private companhiaAereaService: CompanhiaAereaService,
    private confirmationService: ConfirmationService, private messageService: MessageService) { }

  ngOnInit(): void {

    this.buscarAeroportos();
  }

  public visivel: boolean = false;
  public mensagemVisivel: boolean = false;
  public mensagemErro: string = '';
  public exibirErro: boolean = false;
  public processando: boolean = false;
  public edicaoHabilitada: boolean = true;
  public base64Code!: any;
  public imagemVisivel: boolean = false;
  public companhiaAereaFiltrado!: CompanhiaAerea;
  public companhiasAerea: CompanhiaAerea[] = [];
  public companhiaAerea?: CompanhiaAerea;

  public formulario: FormGroup = new FormGroup({
    'descricao': new FormControl(null, [Validators.required, Validators.minLength(3)]),
    'imagem': new FormControl(null)
  })

  exibirImagem(id: string) {

    this.companhiaAereaFiltrado = this.filtrarCompanhiaAerea(id);

    this.imagemVisivel = true;
  }

  filtrarCompanhiaAerea(identificador: string): CompanhiaAerea {
    return this.companhiasAerea.find(elem => elem.identificador === identificador)!
  }

  cadastrar() {
    try {

      this.habilitarSpiner(true);


      this.companhiaAerea = (this.companhiaAerea == undefined || this.companhiaAerea == null) ?
        new CompanhiaAerea('', this.formulario.get('descricao')!.value, null, '') :
        this.companhiaAerea;

      this.companhiaAerea.descricao = this.formulario.get('descricao')!.value;

      if (this.base64Code != undefined) {
        this.companhiaAerea.imagem = this.base64Code;
      }

      console.log(this.companhiaAerea);

      this.companhiaAereaService.cadastrar(this.companhiaAerea)
        .subscribe((resposta: RetornoGenerico) => {
          console.log(resposta);
          if (resposta.codigo === 0) {
            this.habilitarSpiner(false);
            this.limparFormulario();
            this.visivel = false;
            this.messageService.add({ severity: 'info', summary: 'Confirmação', detail: 'Cadastro realizado com sucesso.' });
            this.exibirErro = false;
            this.buscarAeroportos();
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
    this.formulario.controls['descricao'].setValue('')
    this.formulario.controls['imagem'].setValue('')
    this.base64Code = undefined;
    this.companhiaAerea = undefined;
  }
  showDialog(limparObjeto:boolean) {

    if(limparObjeto)
    {
      this.companhiaAerea = undefined;
      this.base64Code = undefined;
    }

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

  buscarAeroportos() {

    this.habilitarSpiner(true);

    this.companhiaAereaService.recuperarDados()
      .subscribe((resposta: RetornoGenerico) => {
        this.habilitarSpiner(false);
        if (resposta.codigo === 0) {
          this.companhiasAerea = resposta.retorno;
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

    this.companhiaAereaService.recuperar(id)
      .subscribe((resposta: RetornoGenerico) => {
        this.habilitarSpiner(false);
        if (resposta.codigo === 0) {
          this.limparFormulario();
          this.companhiaAerea = resposta.retorno;
          this.formulario.controls['descricao'].setValue(this.companhiaAerea!.descricao);
          this.base64Code = this.companhiaAerea!.imagem;
          this.showDialog(false);
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

  editar(id: string) {
    this.edicaoHabilitada = true;
    this.formulario.controls['descricao'].enable();
    this.formulario.controls['imagem'].enable();
    this.base64Code = undefined;
    this.buscar(id);
  }

  visualizar(id: string) {
    this.edicaoHabilitada = false;
    this.formulario.controls['descricao'].disable();
    this.formulario.controls['imagem'].disable();
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
    this.companhiaAereaService.deletar(id)
      .subscribe((resposta: RetornoGenerico) => {
        this.buscarAeroportos();
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
