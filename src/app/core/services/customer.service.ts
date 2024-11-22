import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:8080/client'

  constructor() { }

  list(){
    return this.http.get(this.baseUrl);
  }
}
