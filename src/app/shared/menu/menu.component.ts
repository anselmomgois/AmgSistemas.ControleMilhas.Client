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
              routerLink: 'aeroporto'
            },
            {
              label: 'Cartão de Credito',
              icon: 'fa-solid fa-credit-card',
              routerLink: 'cartaocredito'
            },
            {
              label: 'Companhia Aérea',
              icon: 'fa-solid fa-plane',
              routerLink: 'companhiaaerea'
            },
            {
              label: 'Programas',
              icon: 'fa-solid fa-plane',
              routerLink: 'programa'
            },
            {
              label: 'Membro',
              icon: 'fa-solid fa-user',
              routerLink: 'membro'
            },
            {
              label: 'Empresa',
              icon: 'fa-solid fa-building',
              routerLink: 'empresa'
            },
            {
              label: 'Cotação',
              icon: 'fa-solid fa-money-bill',
              routerLink: 'cotacao'
            },
            {
              label: 'Promoção',
              icon: 'fa-brands fa-adversal',
              routerLink: 'promocao'
            },
            {
              label: 'Programa Sala Vip',
              icon: 'fa-solid fa-passport',
              routerLink: 'programasalavip'
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
            routerLink: 'movimento'
          }
        ]
      }
    ];
  }  
}
