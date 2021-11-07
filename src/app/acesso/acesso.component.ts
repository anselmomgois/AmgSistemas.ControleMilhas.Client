import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-acesso',
  templateUrl: './acesso.component.html',
  styleUrls: ['./acesso.component.css']
})
export class AcessoComponent implements OnInit {

  constructor() { }
  public bolCadastro:boolean = false

  ngOnInit(): void {
  }

  public exibirPainel(event:string):void {
  

    if (event === 'cadastro')
    {
     this.bolCadastro = true;
    }
    else
    {
      this.bolCadastro = false;
    }
  }
}
