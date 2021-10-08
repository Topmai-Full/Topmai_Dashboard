import { Component, OnInit } from '@angular/core';
import { AppService } from '../../../app.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ProductService } from '../../../services/product.service';
import { UploadService } from '../../../services/upload.service';
import { Location } from '@angular/common';
import { environment } from '../../../../environments/environment.prod';
import { CategoryService } from '../../../services/category.service';

@Component({
  selector: 'app-action-product',
  templateUrl: './action-product.component.html',
  styleUrls: ['./action-product.component.scss']
})
export class ActionProductComponent implements OnInit {

  action = false;
  categories: any;
  baseUrl = environment.baseurl;
  user = JSON.parse(localStorage.getItem('user'));
  formObj = {
    id: '',
    name: '',
    image: '',
    description: '',
    category: null,
    user: this.user._id
  }

  constructor(
    private appService: AppService,
    private router: Router,
    private _route: ActivatedRoute,
    private toast: ToastrService,
    private prodSrv: ProductService,
    private uploadSrv: UploadService,
    private location: Location,
    private categorySrv: CategoryService
  ) {

    this.appService.pageTitle = 'Product';
  }
  ngOnInit() {
    this.categorySrv.getAll().subscribe((resp: any) => {
      this.categories = resp.data;
    })

    this.formObj.id = this._route.snapshot.params['id'];
    if (this.formObj.id == 'new') {
      this.action = true;
    } else {
      this.action = false;
      this.prodSrv.getById(this.formObj.id).subscribe((resp: any) => {
        console.log(resp);
        this.formObj.category = resp.data.category;
        this.formObj.name = resp.data.name;
        this.formObj.image = resp.data.image;
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
    console.log(this.formObj);
    if (
      this.formObj.name === '' ||
      this.formObj.image === '' ||
      this.formObj.category === null
    ) {
      this.toast.error('Credentials is not correct', 'Oops', {
        timeOut: 2000,
        positionClass: 'toast-top-right',
        progressBar: true,
        progressAnimation: 'increasing'
      });
    } else {
      this.prodSrv.create(this.formObj).subscribe((resp: any) => {
        console.log(resp);
        if (resp.message === 'success') {
          this.toast.success('Product Added', 'Success', {
            timeOut: 3000,
            positionClass: 'toast-top-right',
            progressBar: true,
            progressAnimation: 'increasing'
          });
          this.backToBack();
        } else if (resp.message === 'alreaday') {
          this.toast.error('Product Name is alreaday Exist', 'Oops', {
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
      this.prodSrv.update(this.formObj).subscribe((resp: any) => {
        console.log(resp);
        if (resp.message === 'success') {
          this.toast.success('Product Update', 'Success', {
            timeOut: 3000,
            positionClass: 'toast-top-right',
            progressBar: true,
            progressAnimation: 'increasing'
          });
          this.backToBack();
        } else if (resp.message === 'alreaday') {
          this.toast.error('Product Name is alreaday Exist', 'Oops', {
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
