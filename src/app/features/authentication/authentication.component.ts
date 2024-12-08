import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoginService } from '../../core/services/LoginService/login-service.service';
import { Router } from '@angular/router';
import { User } from '../../core/models/login.model';

@Component({
  selector: 'app-authentication',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './authentication.component.html',
  styleUrl: './authentication.component.css'
})
export default class AuthenticationComponent {
  error: string = '';

  private loginService = inject(LoginService);
  private router = inject(Router);
  private formBuild = inject(FormBuilder);

  public formLogin: FormGroup = this.formBuild.group({
    user: ['', Validators.required],
    password: ['', Validators.required]
  })

  logIn(){
    if( this.formLogin.invalid) return;
    const login: User = {
      user: this.formLogin.value.user,
      password: this.formLogin.value.password
    }
    this.loginService.login(login).subscribe({
      next: (data) => {
        if(data){
          localStorage.setItem("token", data.access_token);
          this.router.navigate(['dashboard']);
        }
      },
      error:() => {
        this.error = 'Credenciales incorrectas';
      }
    })
  }
} 
