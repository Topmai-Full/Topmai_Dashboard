import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../../environments/environment';
import { AppService } from '../../../app.service';
import { ProductService } from '../../../services/product.service';
import { UploadService } from '../../../services/upload.service';
import { Location } from '@angular/common';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-update-profile',
  templateUrl: './update-profile.component.html',
  styleUrls: ['./update-profile.component.scss']
})
export class UpdateProfileComponent implements OnInit {

  action = false;
  baseUrl = environment.baseurl;
  user = JSON.parse(localStorage.getItem('user'));
  formObj = {
    name: '',
    email: '',
    role: '',
    image: '',
    bio: '',
    lang: '',
    id: ''
  }

  constructor(
    private appService: AppService,
    private router: Router,
    private _route: ActivatedRoute,
    private toast: ToastrService,
    private authStv: AuthService,
    private uploadSrv: UploadService,
    private location: Location
  ) {

    this.appService.pageTitle = 'Update Profile';
  }
  ngOnInit() {
    this.formObj.id = this._route.snapshot.params['id'];
    if (this.formObj.id == 'new') {
      this.action = true;
    } else {
      this.action = false;
      this.authStv.getById(this.user._id).subscribe((resp: any) => {
        this.formObj.id = resp.data._id;
        this.formObj.name = resp.data.name;
        this.formObj.email = resp.data.email;
        this.formObj.image = resp.data.image;
        this.formObj.role = resp.data.role;
        this.formObj.bio = resp.data.bio;
        this.formObj.lang = resp.data.lang;
      })
    }
  }

  upload(event) {
    var file = event.target.files[0];
    this.uploadSrv.saveimage(file).subscribe((data: any) => {
      this.formObj.image = data;
    });
  }


  Update() {
    if (
      this.formObj.name === ''
    ) {
      this.toast.error('Credentials is not correct', 'Oops', {
        timeOut: 2000,
        positionClass: 'toast-top-right',
        progressBar: true,
        progressAnimation: 'increasing'
      });
    } else {
      this.authStv.update(this.formObj).subscribe((resp: any) => {
        console.log(resp);
        if (resp.message === 'success') {
          this.toast.success('Profile Updated', 'Success', {
            timeOut: 3000,
            positionClass: 'toast-top-right',
            progressBar: true,
            progressAnimation: 'increasing'
          });
          this.authStv.getById(this.user._id).subscribe((resp: any) => {
            localStorage.setItem('user', JSON.stringify(resp.data))
          })
          this.backToBack();
        } else {
          console.log('somthing went wrong');
        }
      });
    }
  }

  backToBack() {
    this.location.back();
  }

}
