import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AeroportoService } from 'src/app/shared/services/aeroporto.service';

@Component({
  selector: 'app-aeroporto',
  templateUrl: './aeroporto.component.html',
  styleUrls: ['./aeroporto.component.css'],
  providers: [ConfirmationService, MessageService]
})
export class AeroportoComponent implements OnInit {

  constructor(private aeroportoService: AeroportoService,
              private confirmationService: ConfirmationService, private messageService: MessageService,
              private sanitizer: DomSanitizer) { }

  ngOnInit(): void {

    //this.buscarProgramas();
  }
}
