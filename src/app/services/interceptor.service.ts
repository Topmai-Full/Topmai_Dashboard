import { HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/do';

@Injectable({
  providedIn: 'root'
})
export class InterceptorService {

  constructor(private injector: Injector, private router: Router) { }
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let token = localStorage.getItem('token');
    if (token) {

      let tokenizedReq = request.clone({
        setHeaders: {
          'Access-Token': token
        }
      })
      return next.handle(tokenizedReq).do(event => { }, err => {
        if (err instanceof HttpErrorResponse && err.status === 401) {
          localStorage.clear();
          this.router.navigate(['/login']);
        }
      });
    } else {

      let tokenizedReq = request.clone({
        setHeaders: {
          Authorization: ''
        }
      })
      return next.handle(tokenizedReq);
    }
  }
}
