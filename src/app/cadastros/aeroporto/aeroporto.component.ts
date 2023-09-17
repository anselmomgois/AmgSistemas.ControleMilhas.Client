import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmEventType, ConfirmationService, MessageService } from 'primeng/api';
import { Observable, Subscriber } from 'rxjs';
import { RetornoGenerico } from 'src/app/shared/interfaces/retorno-generico.interface';
import { Aeroporto } from 'src/app/shared/model/aeroporto.model';
import { AeroportoService } from 'src/app/shared/services/aeroporto.service';

@Component({
  selector: 'app-aeroporto',
  templateUrl: './aeroporto.component.html',
  styleUrls: ['./aeroporto.component.css'],
  providers: [ConfirmationService, MessageService]
})
export class AeroportoComponent implements OnInit {

  constructor(private aeroportoService: AeroportoService,
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
  public imagemVisivel:boolean = false;
  public aeroportoFiltrado!:Aeroporto;
  public aeroportos: Aeroporto[] = [];
  public aeroporto?: Aeroporto;

  public formulario: FormGroup = new FormGroup({
    'descricao': new FormControl(null, [Validators.required, Validators.minLength(2)]),
    'codigo': new FormControl(null, [Validators.required, Validators.minLength(3), Validators.maxLength(3)]),
    'imagem': new FormControl(null)
  })

  exibirImagem(id:string) {
   
    this.aeroportoFiltrado = this.filtrarAeroporto(id);
   
    this.imagemVisivel = true;
  }

  filtrarAeroporto(identificador:string):Aeroporto {
    return this.aeroportos.find(elem => elem.identificador === identificador)!
  }

  cadastrar() {
    try {

      this.habilitarSpiner(true);


      this.aeroporto = (this.aeroporto == undefined || this.aeroporto == null) ?
        new Aeroporto('', this.formulario.get('codigo')!.value, this.formulario.get('descricao')!.value, null, '') :
        this.aeroporto;



      this.aeroporto.descricao = this.formulario.get('descricao')!.value;
      this.aeroporto.codigo = this.formulario.get('codigo')!.value;

      this.aeroporto.imagem = undefined;

      this.aeroporto.imagem = this.base64Code;

      this.aeroportoService.cadastrar(this.aeroporto)
        .subscribe((resposta: RetornoGenerico) => {

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
    this.formulario.controls['codigo'].setValue('')
    this.formulario.controls['imagem'].setValue('')
    this.base64Code = undefined;
    this.aeroporto = undefined;
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

    this.aeroportoService.recuperarDados()
      .subscribe((resposta: RetornoGenerico) => {
        this.habilitarSpiner(false);
        if (resposta.codigo === 0) {
          this.aeroportos = resposta.retorno;        
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

  buscarAeroporto(id: string) {

    this.habilitarSpiner(true);

    this.aeroportoService.recuperar(id)
      .subscribe((resposta: RetornoGenerico) => {
        this.habilitarSpiner(false);
        if (resposta.codigo === 0) {   
          this.limparFormulario();      
          this.aeroporto = resposta.retorno;
          this.formulario.controls['descricao'].setValue(this.aeroporto!.descricao);
          this.formulario.controls['codigo'].setValue(this.aeroporto!.codigo);
          this.base64Code = this.aeroporto!.imagem;
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
    this.formulario.controls['descricao'].enable();
    this.formulario.controls['codigo'].enable();
    this.formulario.controls['imagem'].enable();
    this.base64Code = undefined;
    this.buscarAeroporto(id);
  }

  visualizar(id: string) {
    this.edicaoHabilitada = false;
    this.formulario.controls['descricao'].disable();
    this.formulario.controls['codigo'].disable();
    this.formulario.controls['imagem'].disable();
    this.base64Code = undefined;
    this.buscarAeroporto(id);
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
    this.aeroportoService.deletar(id)
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
