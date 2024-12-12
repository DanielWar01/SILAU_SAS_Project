import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { appsettings } from '../../settings/appsettings';
import { Observable } from 'rxjs';
import { Contact } from '../../models/contact';

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  private http = inject(HttpClient);
  private CONTACT_URL: string = appsettings.apiUrl+'email/';

  constructor() {}

  login(contact: Contact): Observable<any> {
    return this.http.post<any>(this.CONTACT_URL, contact);
  }
}
