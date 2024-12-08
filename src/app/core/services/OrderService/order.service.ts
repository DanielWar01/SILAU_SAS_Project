import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { appsettings } from '../../settings/appsettings';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private http = inject(HttpClient);
  private ORDER_URL: string = appsettings.apiUrl+'order/';

  constructor() { }

  list(): Observable<any>{
    return this.http.get<any>(this.ORDER_URL);
  }
}
