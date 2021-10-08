import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  baseUrl = environment.baseurl;
  constructor(private http: HttpClient) { }

  saveimage(file) {
    var fd = new FormData();
    fd.append('image', file);
    return this.http.post(this.baseUrl + '/upload/save', fd);
  }
}
