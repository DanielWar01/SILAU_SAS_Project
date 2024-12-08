import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { appsettings } from '../../settings/appsettings';
import { Observable } from 'rxjs';
import { ResponseCustomer } from '../../models/ResponseCustomer.model';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private http = inject(HttpClient);
  private CLIENT_URL: string = appsettings.apiUrl+'client/';

  constructor() { }

  list(): Observable<ResponseCustomer>{
    return this.http.get<ResponseCustomer>(this.CLIENT_URL);
  }
  
}
