import { Subscriber } from 'rxjs';
import { Component } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Login } from 'src/app/shared/model/login.interface';
import { Usuario } from 'src/app/shared/interfaces/usuario.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  public processando: boolean = false;

  constructor(private usuarioService:UsuarioService, private formBuilder: FormBuilder, private router: Router){}

  public formulario: FormGroup = this.formBuilder.group(
    {
      usuario: ['anselmo', Validators.required],
      senha: ['123', Validators.required]
    }
  );

  public logar(): void {

    this.processando = true;

    if (this.formulario.valid) {
      this.usuarioService.logar(this.formulario.controls['usuario'].value, this.formulario.controls['senha'].value);     
      this.processando = false;
      this.router.navigate(['./principal']); 
    }

    this.processando = false;
  }
}
