import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivateChild, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Auth2Guard implements CanActivateChild {
  constructor(
    private _router : Router){}
    canActivateChild():  boolean{
      if (localStorage.getItem('token')) {
        return true;
      } else {
        this._router.navigate(['/login'])
        return false
      }
    }
}
