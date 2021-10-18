import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../../environments/environment';
import { AppService } from '../../../app.service';
import { ProductService } from '../../../services/product.service';
import { UploadService } from '../../../services/upload.service';
import { Location } from '@angular/common';
import { CategoryService } from '../../../services/category.service';

@Component({
  selector: 'app-action-category',
  templateUrl: './action-category.component.html',
  styleUrls: ['./action-category.component.scss']
})
export class ActionCategoryComponent implements OnInit {
  action = false;
  subacat = false;
  baseUrl = environment.baseurl;
  user = JSON.parse(localStorage.getItem('user'));
  mainCategory: any;
  formObj = {
    id: '',
    name: '',
    image: '',
    description: '',
    parent: null,
    user: this.user._id
  }

  constructor(
    private appService: AppService,
    private router: Router,
    private _route: ActivatedRoute,
    private toast: ToastrService,
    private catSrv: CategoryService,
    private uploadSrv: UploadService,
    private location: Location
  ) {

    this.appService.pageTitle = 'Category';
  }
  ngOnInit() {
    let main = this._route.snapshot.params['main'];
    let id = this._route.snapshot.params['id'];
    if (main == 'main' && id == 'new') {
      this.action = true;
      this.formObj.parent = null;
    } else if (main == 'sub' && id != 'new') {
      this.subacat = true;
      this.action = true;
      this.catSrv.getById(id).subscribe((resp: any) => {
        this.mainCategory = resp.data;
      })
      this.formObj.parent = id;
    } else if (main == 'upd' && id != 'new') {
      this.action = false;
      this.subacat = false;
      this.formObj.id = id;
      this.catSrv.getById(this.formObj.id).subscribe((resp: any) => {
        this.formObj.name = resp.data.name;
        this.formObj.image = resp.data.image;
        this.formObj.parent = resp.data.parent;
        this.formObj.description = resp.data.description;
      })
    }
  }

  upload(event) {
    var file = event.target.files[0];
    this.uploadSrv.saveimage(file).subscribe((data: any) => {
      this.formObj.image = data;
    });
  }

  create() {
    // console.log(this.formObj);
    // return;
    if (
      this.formObj.name === ''
      // this.formObj.image === ''
    ) {
      this.toast.error('Credentials is not correct', 'Message', {
        timeOut: 2000,
        positionClass: 'toast-top-right',
        progressBar: true,
        progressAnimation: 'increasing'
      });
    } else {
      this.catSrv.create(this.formObj).subscribe((resp: any) => {
        console.log(resp);
        if (resp.message === 'success') {
          this.toast.success('Category Added', 'Success', {
            timeOut: 3000,
            positionClass: 'toast-top-right',
            progressBar: true,
            progressAnimation: 'increasing'
          });
          this.backToBack();
        } else if (resp.message === 'alreaday') {
          this.toast.error('Category Name is alreaday Exist', 'Message', {
            timeOut: 2000,
            positionClass: 'toast-top-right',
            progressBar: true,
            progressAnimation: 'increasing'
          });
        } else {
          console.log('somthing went wrong');
        }
      });
    }
  }

  Update() {
    // console.log(this.formObj);
    // return;

    if (
      this.formObj.name === ''
    ) {
      this.toast.error('Credentials is not correct', 'Message', {
        timeOut: 2000,
        positionClass: 'toast-top-right',
        progressBar: true,
        progressAnimation: 'increasing'
      });
    } else {
      this.catSrv.update(this.formObj).subscribe((resp: any) => {
        console.log(resp);
        if (resp.message === 'success') {
          this.toast.success('Category Update', 'Success', {
            timeOut: 3000,
            positionClass: 'toast-top-right',
            progressBar: true,
            progressAnimation: 'increasing'
          });
          this.backToBack();
        } else if (resp.message === 'alreaday') {
          this.toast.error('Category Name is alreaday Exist', 'Message', {
            timeOut: 2000,
            positionClass: 'toast-top-right',
            progressBar: true,
            progressAnimation: 'increasing'
          });
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
