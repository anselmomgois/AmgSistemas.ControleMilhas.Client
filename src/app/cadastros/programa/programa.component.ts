import { HttpErrorResponse, HttpResponse, HttpResponseBase } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService, ConfirmEventType } from 'primeng/api';
import { Observable, Subscriber } from 'rxjs';
import { UsuarioService } from 'src/app/autenticacao/services/usuario.service';
import { RetornoGenerico } from 'src/app/shared/interfaces/retorno-generico.interface';
import { Programa } from 'src/app/shared/model/programa.model';
import { ProgramaService } from 'src/app/shared/services/programa.service';

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
  public edicaoHabilitada: boolean = true;
  public base64Code!: any;

  public programas: Programa[] = [];
  public programa?: Programa;

  public formulario: FormGroup = new FormGroup({
    'descricao': new FormControl(null, [Validators.required, Validators.minLength(2)]),
    'cor': new FormControl(null, [Validators.required, Validators.minLength(2)]),
    'imagem': new FormControl(null),
    'programaBanco': new FormControl<boolean>(true, [Validators.required])
  })

  cadastrar() {
    try {

      this.habilitarSpiner(true);


      this.programa = (this.programa == undefined || this.programa == null) ?
        new Programa('', this.formulario.get('descricao')!.value, this.usuarioService.usuarioCorrente!.identificador,
          this.formulario.get('cor')!.value, null, this.formulario.get('programaBanco')!.value,'') :
        this.programa;



      this.programa.descricao = this.formulario.get('descricao')!.value;
      this.programa.codigoCor = this.formulario.get('cor')!.value;

      this.programa.imagem = undefined;

      this.programa.imagem = this.base64Code;


      this.programa.programaBanco = this.formulario.get('programaBanco')!.value;

      console.log(this.formulario.get('programaBanco')!.value);

      this.programaService.cadastrar(this.programa)
        .subscribe((resposta: RetornoGenerico) => {

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
    this.formulario.controls['descricao'].setValue('')
    this.formulario.controls['imagem'].setValue('')
    this.formulario.controls['programaBanco'].setValue(0)
    this.formulario.controls['cor'].setValue('')
    this.base64Code = undefined;
    this.programa = undefined;
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

    this.programaService.recuperarProgramas(this.usuarioService.usuarioCorrente!.identificador)
      .subscribe((resposta: RetornoGenerico) => {
        this.habilitarSpiner(false);
        if (resposta.codigo === 0) {
          this.programas = resposta.retorno;        
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
          this.limparFormulario();      
          this.programa = resposta.retorno;
          this.formulario.controls['descricao'].setValue(this.programa!.descricao);
          this.formulario.controls['cor'].setValue(this.programa!.codigoCor);
          this.base64Code = this.programa!.imagem;
          this.formulario.controls['programaBanco'].setValue(this.programa!.programaBanco);
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
    this.formulario.enable();
    this.base64Code = undefined;
    this.buscarPrograma(id);
  }

  visualizarPrograma(id: string) {
    this.edicaoHabilitada = false;
    this.formulario.disable();
    this.base64Code = undefined;
    this.buscarPrograma(id);
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
    this.programaService.deletarPrograma(id)
      .subscribe((resposta: RetornoGenerico) => {
        this.buscarProgramas();
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
