import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { appsettings } from '../../settings/appsettings';
import { Observable, tap } from 'rxjs';
import { ResponseLogin } from '../../models/responseLogin.model';
import { User } from '../../models/login.model';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private http = inject(HttpClient);
  private LOGIN_URL: string = appsettings.apiUrl+'auth/login';

  constructor() {}

  login(user: User): Observable<ResponseLogin> {
    return this.http.post<ResponseLogin>(this.LOGIN_URL, user);
  }

}
