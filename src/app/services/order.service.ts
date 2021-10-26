import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  baseUrl = environment.baseurl;
  constructor(private http: HttpClient) { }

  OrderByuser(userId) {
    return this.http.get(this.baseUrl + '/order/getAllByuser/' + userId);
  }

  getAll() {
    return this.http.get(this.baseUrl + '/order/getAll');
  }

  Orderlength(shopId) {
    return this.http.get(this.baseUrl + '/order/length/' + shopId);
  }

  getallOrderProducts(OrderId) {
    return this.http.get(this.baseUrl + '/order/getallorderProducts/' + OrderId);
  }

  changeOrderstatus(data) {
    return this.http.post(this.baseUrl + '/order/update/Orderstatus', data);
  }

  changeOrderstatus2(data) {
    return this.http.post(this.baseUrl + '/order/update/Orderstatus2', data);
  }

  getall_OrderActivity(Id) {
    return this.http.get(this.baseUrl + '/order/getallActivity/' + Id);
  }

}
