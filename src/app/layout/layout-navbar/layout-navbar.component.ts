import { Component, Input, HostBinding } from '@angular/core';
import { AppService } from '../../app.service';
import { LayoutService } from '../../layout/layout.service';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment.prod';

@Component({
  selector: 'app-layout-navbar',
  templateUrl: './layout-navbar.component.html',
  styles: [':host { display: block; }']
})
export class LayoutNavbarComponent {
  isExpanded = false;
  isRTL: boolean;
  userData: any
  baseUrl = environment.baseurl;
  @Input() sidenavToggle = true;

  @HostBinding('class.layout-navbar') private hostClassMain = true;

  constructor(private appService: AppService, private layoutService: LayoutService, private router: Router) {
    this.isRTL = appService.isRTL;
    this.userData = JSON.parse(localStorage.getItem('user'))
  }

  currentBg() {
    return `bg-${this.appService.layoutNavbarBg}`;
  }

  toggleSidenav() {
    this.layoutService.toggleCollapsed();
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login'])
  }
}
