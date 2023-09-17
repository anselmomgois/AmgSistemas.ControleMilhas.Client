import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmEventType, ConfirmationService, MessageService } from 'primeng/api';
import { Observable, Subscriber } from 'rxjs';
import { RetornoGenerico } from 'src/app/shared/interfaces/retorno-generico.interface';
import { ProgramaSalaVip } from 'src/app/shared/model/programaSalaVip.model';
import { ProgramaSalaVipService } from 'src/app/shared/services/programa-sala-vip.service';

@Component({
  selector: 'app-programa-sala-vip',
  templateUrl: './programa-sala-vip.component.html',
  styleUrls: ['./programa-sala-vip.component.css'],
  providers: [ConfirmationService, MessageService]
})
export class ProgramaSalaVipComponent {
  constructor(private programaSalaVipService: ProgramaSalaVipService,
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
  public programaSalaVipFiltrado!: ProgramaSalaVip;
  public programasSalaVip: ProgramaSalaVip[] = [];
  public programaSalaVip?: ProgramaSalaVip;

  public formulario: FormGroup = new FormGroup({
    'descricao': new FormControl(null, [Validators.required, Validators.minLength(5)]),
    'imagem': new FormControl(null)
  })

  exibirImagem(id: string) {

    this.programaSalaVipFiltrado = this.filtrarProgramaSalaVip(id);

    this.imagemVisivel = true;
  }

  filtrarProgramaSalaVip(identificador: string): ProgramaSalaVip {
    return this.programasSalaVip.find(elem => elem.identificador === identificador)!
  }

  cadastrar() {
    try {

      this.habilitarSpiner(true);


      this.programaSalaVip = (this.programaSalaVip == undefined || this.programaSalaVip == null) ?
        new ProgramaSalaVip('', this.formulario.get('descricao')!.value, null,'') :
        this.programaSalaVip;

      this.programaSalaVip.descricao = this.formulario.get('descricao')!.value;

      this.programaSalaVip.imagem = undefined;

      this.programaSalaVip.imagem = this.base64Code;

      console.log(this.programaSalaVip);

      this.programaSalaVipService.cadastrar(this.programaSalaVip)
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
    this.programaSalaVip = undefined;
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

  buscarAeroportos() {

    this.habilitarSpiner(true);

    this.programaSalaVipService.recuperarDados()
      .subscribe((resposta: RetornoGenerico) => {
        this.habilitarSpiner(false);
        if (resposta.codigo === 0) {
          this.programasSalaVip = resposta.retorno;
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

    this.programaSalaVipService.recuperar(id)
      .subscribe((resposta: RetornoGenerico) => {
        this.habilitarSpiner(false);
        if (resposta.codigo === 0) {
          this.limparFormulario();
          this.programaSalaVip = resposta.retorno;
          this.formulario.controls['descricao'].setValue(this.programaSalaVip!.descricao);
          this.base64Code = this.programaSalaVip!.imagem;
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
    this.programaSalaVipService.deletar(id)
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
