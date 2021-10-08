import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  baseUrl = environment.baseurl;

  constructor(private http: HttpClient) { }

  create(data) {
    return this.http.post(this.baseUrl + '/user/create', data);
  }

  signin(data) {
    return this.http.post(this.baseUrl + '/user/signin', data);
  }

  getById(id) {
    return this.http.get(this.baseUrl + '/user/' + id);
  }

  update(data) {
    return this.http.post(this.baseUrl + '/user/update', data);
  }

  getAllsurvey() {
    return this.http.get(this.baseUrl + '/survey/getAll');
  }

  getAllVotes() {
    return this.http.get(this.baseUrl + '/voteproduct/getAll');
  }

}
