import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmEventType, ConfirmationService, MessageService } from 'primeng/api';
import { Observable, Subscriber, filter, switchMap } from 'rxjs';
import { GuidGenerator } from 'src/app/shared/classes/guidGenerator';
import { RetornoGenerico } from 'src/app/shared/interfaces/retorno-generico.interface';
import { Aeroporto } from 'src/app/shared/model/aeroporto.model';
import { Foto } from 'src/app/shared/model/foto.model';
import { SalaVip } from 'src/app/shared/model/salaVip.model';
import { AeroportoService } from 'src/app/shared/services/aeroporto.service';
import { PhotoService } from 'src/app/shared/services/photoService';
import { SalaVipService } from 'src/app/shared/services/sala-vip.service';

@Component({
  selector: 'app-sala-vip',
  templateUrl: './sala-vip.component.html',
  styleUrls: ['./sala-vip.component.css'],
  providers: [ConfirmationService, MessageService]
})
export class SalaVipComponent implements OnInit {

  constructor(private salaVipService: SalaVipService,
    private confirmationService: ConfirmationService, private messageService: MessageService,
    private aeroportoService: AeroportoService, private photoService: PhotoService) { }

  ngOnInit(): void {

    this.buscarDados();

    this.responsiveOptions = [
      {
        breakpoint: '1024px',
        numVisible: 5
      },
      {
        breakpoint: '768px',
        numVisible: 3
      },
      {
        breakpoint: '560px',
        numVisible: 1
      }
    ];
  }

  public visivel: boolean = false;
  public carregarFotoVisivel: boolean = false;
  public mensagemVisivel: boolean = false;
  public mensagemErro: string = '';
  public exibirErro: boolean = false;
  public processando: boolean = false;
  public edicaoHabilitada: boolean = true;
  public imagemVisivel: boolean = false;
  public salaVipFiltrado!: SalaVip;
  public salasVip: SalaVip[] = [];
  public salaVip?: SalaVip;
  public aeroportos: Aeroporto[] = [];
  public fotos: Foto[] = [];
  public images: any[] = [];
  public cssDivFoto: string = '';
  public responsiveOptions: any[] = [];
  public base64Code!: any;

  public formulario: FormGroup = new FormGroup({
    'identificador': new FormControl<string>(''),
    'descricao': new FormControl<string>('', [Validators.required, Validators.minLength(5)]),
    'observacaoLocalizacao': new FormControl<string>('', [Validators.required, Validators.minLength(10)]),
    'aeroporto': new FormControl<Aeroporto>(new Aeroporto('', '', '', null), [Validators.required]),
    'fotos': new FormControl<Foto[]>([], [Validators.required])
  })

  public formularioFoto: FormGroup = new FormGroup({
    'identificador': new FormControl<string>(''),
    'identificadorTemporario': new FormControl<string>('', [Validators.required]),
    'descricao': new FormControl<string>('', [Validators.required, Validators.minLength(5)]),
    'capa': new FormControl<boolean>(false),
    'ativa': new FormControl<boolean>(false),
    'imagem': new FormControl<any>([], [Validators.required])
  })

  exibirImagem(id: string) {

    this.salaVipFiltrado = this.filtrarSalaVip(id);
    this.imagemVisivel = true;
  }

  filtrarSalaVip(identificador: string): SalaVip {
    return this.salasVip.find(elem => elem.identificador === identificador)!
  }



  fotoCorrente(): Foto {

    const foto = this.formularioFoto.value as Foto;

    return foto
  }

  salaVipCorrente(): SalaVip {

    const salaVip = this.formulario.value as SalaVip;

    return salaVip
  }

  getFotos(): any[] {

    let fotos: any[] = [];

    if (this.fotos != undefined) {
      this.fotos.forEach((item: Foto) => {

        if (item.ativa) {
          fotos.push({
            imagem: item.imagem,
            descricao: item.descricao,
            capa: item.capa,
            identificadorTemporario: item.identificadorTemporario
          });
        }
      })
    }

    return fotos;
  }

  carregarFoto() {

    try {

      this.formularioFoto.controls['ativa'].setValue(true)
      // this.formularioFoto.controls['identificadorTemporario'].setValue(true)
      if (this.formularioFoto.status === 'INVALID') {

        return;

      }
      else {

        if (this.fotoCorrente().capa) {
          this.fotos.forEach((item: Foto) => {
            item.capa = false;
          })
        }

        this.definirFotoCapa(true);

        this.fotos.push(this.fotoCorrente())
        this.carregarFotos();
        this.carregarFotoVisivel = false;
        this.formulario.controls['fotos'].setValue(this.fotos)
      }
    }
    catch (e) {
      this.habilitarSpiner(false);
      this.exibirJanelaErro('Erro Geral');
    }
  }

  definirFotoCapa(bolCadastro: boolean) {
    let existeFotoCapa = this.fotos.filter((elem: Foto) => elem.capa && elem.ativa);

    if (existeFotoCapa === undefined || existeFotoCapa.length === 0) {

      if (bolCadastro) {
        this.formularioFoto.controls['capa'].setValue(true);
      }
      else {
        let fotosAtivas = this.fotos.filter((elem: Foto) => elem.ativa)
        if (fotosAtivas.length > 0) {
          fotosAtivas[0].capa = true;
        }
      }

    }
  }

  excluirFoto(identificador: string) {

    let foto = this.fotos.find(elem => elem.identificadorTemporario === identificador)

    if (foto != undefined) {

      foto.ativa = false;

      if (foto.capa) {
        foto.capa = false;

        this.definirFotoCapa(false);
      }

      this.carregarFotos();
    }
  }

  carregarFotos() {
    this.images = this.getFotos();
  }

  cadastrar() {
    try {
      console.log('passou aqui')
      if (this.formulario.status === 'INVALID') {

        return;

      }
      else {
        this.habilitarSpiner(true);


        this.salaVipService.cadastrar(this.salaVipCorrente())
          .subscribe((resposta: RetornoGenerico) => {

            if (resposta.codigo === 0) {
              this.habilitarSpiner(false);
              this.limparFormulario();
              this.visivel = false;
              this.exibirErro = false;
              this.buscarSalasVip();
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
    this.formulario.controls['identificador'].setValue('')
    this.formulario.controls['descricao'].setValue('')
    this.formulario.controls['observacaoLocalizacao'].setValue('')
    this.formulario.controls['aeroporto'].setValue(new Aeroporto('', '', '', null))
    this.formulario.controls['fotos'].setValue([])
    this.fotos = [];
    this.salaVip = undefined;
  }

  limparFormularioFoto() {
    this.formularioFoto.reset(new Foto('', '', false, '', true, GuidGenerator.newGuid()))
    this.base64Code = undefined;
  }

  showDialog() {


    this.exibirErro = false;
    this.mensagemVisivel = false;
    this.visivel = !this.visivel;
  }

  showCarregarFoto() {
    this.exibirErro = false;
    this.mensagemVisivel = false;
    this.limparFormularioFoto();
    this.carregarFotoVisivel = true;
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

    this.buscarAeropostos();
  }

  buscarAeropostos(): void {
    this.aeroportoService.recuperarDadosBasicos()
      .subscribe((resposta: RetornoGenerico) => {
        if (resposta.codigo === 0) {
          this.aeroportos = resposta.retorno;
          this.buscarSalasVip();
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

  buscarSalasVip(): void {

    this.salaVipService.recuperarDados()
      .subscribe((resposta: RetornoGenerico) => {
        this.habilitarSpiner(false);
        if (resposta.codigo === 0) {
          this.salasVip = resposta.retorno;
          console.log(this.salasVip)
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

    this.salaVipService.recuperar(id)
      .subscribe((resposta: RetornoGenerico) => {
        this.habilitarSpiner(false);
        if (resposta.codigo === 0) {
          this.limparFormulario();

          this.salaVip = resposta.retorno;
          this.fotos = this.salaVip!.fotos;          
          this.formulario.reset(this.salaVip);
          this.carregarFotos();

          console.log(this.fotos);

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

  adicionar() {
    this.edicaoHabilitada = true;
    this.formulario.controls['descricao'].enable();
    this.formulario.controls['identificador'].enable();
    this.formulario.controls['observacaoLocalizacao'].enable();
    this.formulario.controls['aeroporto'].enable();
    this.formulario.controls['fotos'].enable();
    this.fotos = [];
    this.showDialog();
  }

  editar(id: string) {
    this.edicaoHabilitada = true;
    this.formulario.controls['descricao'].enable();
    this.formulario.controls['identificador'].enable();
    this.formulario.controls['observacaoLocalizacao'].enable();
    this.formulario.controls['aeroporto'].enable();
    this.formulario.controls['fotos'].enable();
    this.fotos = [];
    this.buscar(id);
  }

  visualizar(id: string) {
    this.edicaoHabilitada = false;
    this.formulario.controls['descricao'].disable();
    this.formulario.controls['identificador'].disable();
    this.formulario.controls['observacaoLocalizacao'].disable();
    this.formulario.controls['aeroporto'].disable();
    this.formulario.controls['fotos'].disable();
    this.fotos = [];
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
    this.salaVipService.deletar(id)
      .subscribe((resposta: RetornoGenerico) => {
        if (resposta.codigo === 0) {
          this.buscarSalasVip();
          this.messageService.add({ severity: 'info', summary: 'Confirmação', detail: 'Registro deletado com sucesso.' });
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

  changeCss() {
    this.cssDivFoto = "padding-top: 10px !important;";
  }

  onUpload(event: any) {
    const file = (event.files as FileList)[0];

    this.convertToBase64(file);
    this.messageService.add({ severity: 'info', summary: 'Success', detail: 'File Uploaded with Basic Mode' });
  }

  public preparaImagemUpload(event: Event): void {

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
      this.formularioFoto.controls['imagem'].setValue(this.base64Code);
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
