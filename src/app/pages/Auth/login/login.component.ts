import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AppService } from '../../../app.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss', '../../../../vendor/styles/pages/authentication.scss']
})
export class LoginComponent implements OnInit {


  credentials = {
    email: '',
    password: '',
    rememberMe: false
  };

  constructor(
    private appService: AppService,
    private AuthSrv: AuthService,
    private toast: ToastrService,
    private router: Router,
  ) {
    this.appService.pageTitle = 'Login';
  }

  ngOnInit() {
  }

  login() {
    if (this.credentials.email == '' || this.credentials.password == '') {
      this.toast.error('Please fill all fields', '', {
        timeOut: 2000,
        positionClass: 'toast-top-right',
        progressBar: true,
        progressAnimation: 'increasing'
      });
    } else {
      if (this.credentials.password.length <= 7) {
        this.toast.error('Password minimum eight characted long ', '', {
          timeOut: 2000,
          positionClass: 'toast-top-right',
          progressBar: true,
          progressAnimation: 'increasing'
        });
      } else {
        this.AuthSrv.signin(this.credentials).subscribe((resp: any) => {
          console.log(resp);
          if (resp.message == 'success') {
            localStorage.setItem('token', resp.token);
            localStorage.setItem('user', JSON.stringify(resp.data));
            this.router.navigate(['/dashboard'])
          } else if (resp.message == 'Un Authorized') {
            this.toast.error('Your credentials is not Correct', '', {
              timeOut: 2000,
              positionClass: 'toast-top-right',
              progressBar: true,
              progressAnimation: 'increasing'
            });
          } else {
            console.log('something went wrong')
          }
        })
      }
    }
  }



}
