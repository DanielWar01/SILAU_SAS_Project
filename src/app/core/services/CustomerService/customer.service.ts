import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { appsettings } from '../../settings/appsettings';
import { Observable } from 'rxjs';
import { ResponseCustomer } from '../../models/ResponseCustomer.model';
import { Customer } from '../../models/customer.model';
import { CustomerSave } from '../../models/CustomerSave.model';

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

  createCustomer(customer : CustomerSave): Observable<any>{
    return this.http.post<any>(`${this.CLIENT_URL}1`, customer);
  }

  updateCustomer(idCustomer?: string, customer?: CustomerSave): Observable<any> {
    return this.http.put<any>(`${this.CLIENT_URL}${idCustomer}`, customer);
  }
  
  deleteCustomer(idCustomer: string): void {
    this.http.delete(`${this.CLIENT_URL}${idCustomer}`);
  }

}
