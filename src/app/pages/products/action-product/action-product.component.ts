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
  subCategories: any;
  baseUrl = environment.baseurl;
  user = JSON.parse(localStorage.getItem('user'));
  multiImages = [];

  formObj = {
    id: '',
    title: '',
    subtitle: '',
    image: [],
    description: '',
    price: '',
    oldprice: '',
    parentcategory: null,
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
    this.formObj.id = this._route.snapshot.params['id'];
    this.categorySrv.getAll().subscribe((resp: any) => {
      this.categories = resp.data;
      this.categorySrv.getAllSub(resp.data[0]._id).subscribe((resp: any) => {
        this.subCategories = resp.data;

        if (this.formObj.id == 'new') {
          this.action = true;
        } else {
          this.action = false;
          this.prodSrv.getById(this.formObj.id).subscribe((resp: any) => {
            console.log(resp)
            this.formObj.oldprice = resp.data.oldprice;
            this.formObj.price = resp.data.price;
            this.formObj.category = resp.data.category;
            this.formObj.parentcategory = resp.data.parentcategory;
            this.formObj.title = resp.data.title;
            this.formObj.subtitle = resp.data.subtitle;
            this.multiImages = resp.data.image;
            this.formObj.description = resp.data.description;
            console.log(this.formObj)
          })
        }

      })
    })
  }

  changeCat(val) {
    this.categorySrv.getAllSub(val).subscribe((resp: any) => {
      this.subCategories = resp.data;
    })
  }

  upload(event) {
    var file = event.target.files[0];
    var inc = 0;
    this.uploadSrv.saveimage(file).subscribe((data: any) => {
      var incid = inc++;
      this.multiImages.push({ id: incid, image: data });
    });
  }

  create() {
    this.formObj.image = this.multiImages;
    if (
      this.formObj.price === '' ||
      this.formObj.title === '' ||
      this.formObj.image.length < 1 ||
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
    this.formObj.image = this.multiImages;
    if (
      this.formObj.title === '' ||
      this.formObj.price === '' ||
      this.formObj.image.length < 1 ||
      this.formObj.category === null
    ) {
      this.toast.error('Credentials is not correct', 'Oops', {
        timeOut: 2000,
        positionClass: 'toast-top-right',
        progressBar: true,
        progressAnimation: 'increasing'
      });
    } else {
      this.prodSrv.update(this.formObj).subscribe((resp: any) => {
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

  imgRemove(index) {
    this.multiImages.splice(index, 1);
  }


}
