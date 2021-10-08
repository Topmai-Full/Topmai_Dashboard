import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AppService } from '../../../app.service';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss', '../../../../vendor/styles/pages/authentication.scss']
})
export class SignupComponent implements OnInit {

  credentials = {
    name: '',
    email: '',
    password: '',
    cpassword: '',
    role: 'Admin'
  };

  constructor(
    private appService: AppService,
    private AuthSrv: AuthService,
    private toast: ToastrService,
    private router: Router,
  ) {
    this.appService.pageTitle = 'Register';
  }

  ngOnInit() {
  }

  register() {
    console.log(this.credentials)
    if (
      this.credentials.email == '' ||
      this.credentials.name == '' ||
      this.credentials.password == '' ||
      this.credentials.cpassword == ''
    ) {
      this.toast.error('Fill all fields', '', {
        timeOut: 2000,
        positionClass: 'toast-top-right',
        progressBar: true,
        progressAnimation: 'increasing'
      });
    } else {

      if (this.credentials.cpassword.length <= 7 || this.credentials.password.length <= 7) {
        this.toast.error('Password must be eight charactes long', '', {
          timeOut: 2000,
          positionClass: 'toast-top-right',
          progressBar: true,
          progressAnimation: 'increasing'
        });
      } else {
        if (this.credentials.cpassword != this.credentials.password) {
          this.toast.error('Password not matched', '', {
            timeOut: 2000,
            positionClass: 'toast-top-right',
            progressBar: true,
            progressAnimation: 'increasing'
          });
        } else {
          this.AuthSrv.create(this.credentials).subscribe((resp: any) => {
            console.log(resp);
            if (resp.message == 'success') {
              this.toast.success('Admin created successfully', '', {
                timeOut: 2000,
                positionClass: 'toast-top-right',
                progressBar: true,
                progressAnimation: 'increasing'
              });
              this.router.navigate(['/login'])
            } else if (resp.message == 'Already Exist') {
              this.toast.error('Email is already exist', '', {
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


}
