import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ContactUsService {

  baseUrl = environment.baseurl + '/contactus/';

  constructor(private http: HttpClient) { }

  create(data) {
    return this.http.post(this.baseUrl + 'create', data);
  }

  getAll() {
    return this.http.get(this.baseUrl + 'getAll');
  }
}
