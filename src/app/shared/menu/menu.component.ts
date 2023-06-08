import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  items: MenuItem[] = [];
  
  ngOnInit(): void {
   
    this.items = [
      {
        label: 'Cadastros',
        icon: 'fa-sharp fa-solid fa-clipboard',
        items: [
            {
              label: 'Aeroporto',
              icon: 'fa-solid fa-plane-departure',
              routerLink: 'cadastros/aeroporto'
            },
            {
              label: 'Cartão de Credito',
              icon: 'fa-solid fa-credit-card',
              routerLink: 'cadastros/cartaocredito'
            },
            {
              label: 'Companhia Aérea',
              icon: 'fa-solid fa-plane',
              routerLink: 'cadastros/companhiaaerea'
            },
            {
              label: 'Programas',
              icon: 'fa-solid fa-plane',
              routerLink: 'cadastros/programa'
            },
            {
              label: 'Membro',
              icon: 'fa-solid fa-user',
              routerLink: 'cadastros/membro'
            },
            {
              label: 'Empresa',
              icon: 'fa-solid fa-building',
              routerLink: 'cadastros/empresa'
            },
            {
              label: 'Cotação',
              icon: 'fa-solid fa-money-bill',
              routerLink: 'cadastros/cotacao'
            },
            {
              label: 'Promoção',
              icon: 'fa-brands fa-adversal',
              routerLink: 'cadastros/promocao'
            },
            {
              label: 'Programa Sala Vip',
              icon: 'fa-solid fa-passport',
              routerLink: 'cadastros/programasalavip'
            },
            {
              label: 'Sala Vip',
              icon: 'fa-solid fa-people-roof',
              routerLink: 'cadastros/salavip'
            }
        ]
      },
      {
        label: 'Operação',
        icon: 'fa-solid fa-money-bill-trend-up',
        items: [
          {
            label: 'Movimentos',
            icon: 'fa-solid fa-sack-dollar',
            routerLink: 'operacao/movimento'
          }
        ]
      }
    ];
  }  
}
