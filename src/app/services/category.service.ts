import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  baseUrl = environment.baseurl + '/category/';

  constructor(private http: HttpClient) { }

  create(data) {
    return this.http.post(this.baseUrl + 'create', data);
  }

  getById(id) {
    return this.http.get(this.baseUrl + 'getById/' + id);
  }

  getAll() {
    return this.http.get(this.baseUrl + 'getAll');
  }

  getAllSub(id) {
    return this.http.get(this.baseUrl + 'getAllSub/'+id);
  }

  delete(id) {
    return this.http.delete(this.baseUrl + 'delete/' + id);
  }

  update(data) {
    return this.http.post(this.baseUrl + 'update', data);
  }
}
