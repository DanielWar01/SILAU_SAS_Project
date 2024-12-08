import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { appsettings } from '../../settings/appsettings';
import { Observable } from 'rxjs';
import { ResponseCustomer } from '../../models/ResponseCustomer.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private http = inject(HttpClient);
  private PRODUCT_URL: string = appsettings.apiUrl+'products/';

  constructor() { }

  list(): Observable<any>{
    return this.http.get<any>(this.PRODUCT_URL);
  }
}
