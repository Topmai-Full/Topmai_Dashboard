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
  prodOptions = [];
  comb = [];
  cominations: any;
  ObjForm = { price: '', quantity: '', picture: '' };
  seleted_Obj = [];
  isSelected = false;
  productType: any;
  allSelected = false;
  matchOption_values = false;

  combine = ([head, ...[headTail, ...tailTail]]) => {
    if (!headTail) return head
    const combined = headTail.reduce((acc, x) => {
      return acc.concat(head.map((h) => [h, x]))
    }, [])
    return this.combine([combined, ...tailTail])
  }

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
    user: this.user._id,
    combinations: [],
    productoptions: [],
    variations: '',
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
    })

    if (this.formObj.id == 'new') {
      this.action = true;
      this.categorySrv.getAllSub(this.categories[0]._id).subscribe((resp: any) => {
        this.subCategories = resp.data;
      })
    } else {
      this.action = false;
      this.prodSrv.getById(this.formObj.id).subscribe((resp: any) => {
        if (resp.product.category){
          this.formObj.category = resp.product.category._id;
        }
        this.formObj.oldprice = resp.product.oldprice;
        this.formObj.price = resp.product.price;
        this.formObj.parentcategory = resp.product.parentcategory._id;
        this.formObj.title = resp.product.title;
        this.formObj.subtitle = resp.product.subtitle;
        this.multiImages = resp.product.image;
        this.formObj.description = resp.product.description;
        this.formObj.variations = resp.product.variations;

        this.categorySrv.getAllSub(this.formObj.parentcategory).subscribe((resp: any) => {
          this.subCategories = resp.data;
        })

        for (let i = 0; i < resp.options.length; i++) {
          this.prodOptions.push({ options: [], values: '' })
          this.prodOptions[i].values = resp.options[i].values.value;
          for (let j = 0; j < resp.options[i].options.length; j++) {
            this.prodOptions[i].options.push(resp.options[i].options[j].value)
          }
        }
        this.cominations = resp.pvov;
        console.log(this.formObj);
      })
    }
  }

  // Make Combnation
  combineArrays(array_of_arrays) {
    if (!array_of_arrays) {
      return []
    }
    if (!Array.isArray(array_of_arrays)) {
      return []
    }
    if (array_of_arrays.length == 0) {
      return []
    }
    for (let i = 0; i < array_of_arrays.length; i++) {
      if (
        !Array.isArray(array_of_arrays[i]) ||
        array_of_arrays[i].length == 0
      ) {
        return []
      }
    }
    let odometer = new Array(array_of_arrays.length)
    odometer.fill(0)
    let output = []
    let newCombination = this.formCombination(odometer, array_of_arrays)
    output.push(this.combineAgainNew(newCombination))
    while (this.odometer_increment(odometer, array_of_arrays)) {
      newCombination = this.formCombination(odometer, array_of_arrays)
      output.push(this.combineAgainNew(newCombination))
    }
    return output
  }

  formCombination(odometer, array_of_arrays) {
    return odometer.reduce(function (
      accumulator,
      odometer_value,
      odometer_index,
    ) {
      return (
        '' + accumulator + array_of_arrays[odometer_index][odometer_value]
      )
    },
      '')
  }

  odometer_increment(odometer, array_of_arrays) {
    for (
      let i_odometer_digit = odometer.length - 1;
      i_odometer_digit >= 0;
      i_odometer_digit--
    ) {
      let maxee = array_of_arrays[i_odometer_digit].length - 1

      if (odometer[i_odometer_digit] + 1 <= maxee) {
        odometer[i_odometer_digit]++
        return true
      } else {
        if (i_odometer_digit - 1 < 0) {
          return false
        } else {
          odometer[i_odometer_digit] = 0
          continue
        }
      }
    }
  }

  createCombination() {
    let arrs = [];
    this.comb = [];
    for (const i of this.prodOptions) {
      var opt = [];
      for (const j of i.options) {
        opt.push(":" + j + ":");
      }

      arrs.push(opt)
    }
    var data = this.combineArrays(arrs)
    for (const i of data) {
      this.comb.push({ data: i, picture: "", price: "", quantity: "", values: "", selected: false })
    }
    this.cominations = this.comb;
  }

  combineAgainNew(str) {
    var d = [];
    var a = str.split("::");
    for (const i of a) {
      d.push(i.replaceAll(":", ""));
    }
    return d;
  }

  addanother() {
    this.prodOptions.push({ options: [], values: '' });
  }

  onenter(opt, index, i) {
    var spl = opt.split(',');
    var value = spl[0];
    if (spl.length > 1) {
      value = spl[0];
      i.value = '';
      var check = false;
      for (let i = 0; i < this.prodOptions[index].options.length; i++) {
        if (this.prodOptions[index].options[i] == value) {
          check = true;
        }
      }
      if (check) {
        this.toast.error(value + ' is alreday exist', '', {
          timeOut: 1500,
          positionClass: 'toast-bottom-left',
          progressBar: true,
          progressAnimation: 'increasing'
        });
      } else {
        this.prodOptions[index].options.push(value);
        this.createCombination();
      }
    }

  }

  changeCat(val) {
    this.categorySrv.getAllSub(val).subscribe((resp: any) => {
      this.subCategories = resp.data;
      if (this.subCategories.length > 0){
        console.log(this.subCategories[0]._id)
        this.formObj.category = this.subCategories[0]._id;
      }else{
        this.formObj.category = null;
      }
    })
  }

  selectAll() {
    /*Check if selected then do array empty otherwise push*/
    this.seleted_Obj = [];
    for (let a = 0; a < this.cominations.length; a++) {
      this.seleted_Obj.push(a);
      this.cominations[a].selected = this.allSelected;
    }
    if (!this.allSelected) {
      this.seleted_Obj = [];
    }

    if (this.seleted_Obj.length >= 1) {
      this.isSelected = true;
    } else {
      this.isSelected = false;
      this.ObjForm.price = "";
      this.ObjForm.quantity = "";
      this.ObjForm.picture = "";
    }
  }

  singleSelect(id) {
    var i = this.seleted_Obj.indexOf(id);
    if (i === -1) {
      this.seleted_Obj.push(id);
    }
    else {
      this.seleted_Obj.splice(i, 1);
    }

    if (this.seleted_Obj.length != this.cominations.length) {
      this.allSelected = false;
    } else {
      this.allSelected = true;
    }

    if (this.seleted_Obj.length >= 1) {
      this.isSelected = true;
    } else {
      this.isSelected = false;
      this.ObjForm.price = "";
      this.ObjForm.quantity = "";
      this.ObjForm.picture = "";
    }
  }

  updateSelected() {
    for (let i = 0; i < this.seleted_Obj.length; i++) {

      if (this.ObjForm.price == null || this.ObjForm.price == '') {
      } else {
        this.cominations[this.seleted_Obj[i]].price = this.ObjForm.price;
      }
      if (this.ObjForm.quantity == null || this.ObjForm.quantity == '') {
      } else {
        this.cominations[this.seleted_Obj[i]].quantity = this.ObjForm.quantity;
      }
      if (this.ObjForm.picture == '' || this.ObjForm.picture == null) {
      } else {
        this.cominations[this.seleted_Obj[i]].picture = this.ObjForm.picture;
      }

    }
  }

  removeField(index) {
    if (this.prodOptions.length == 1) {
      this.toast.error('Minimum 1 field is required', '', {
        timeOut: 2000,
        positionClass: 'toast-bottom-left',
        progressBar: true,
        progressAnimation: 'increasing'
      });
    } else {
      this.prodOptions.splice(index, 1);
      this.createCombination();
    }
  }

  onBlurMethod(index) {
    for (let i = 0; i < this.prodOptions.length; i++) {
      if (this.prodOptions[index] == this.prodOptions[i]) {

      } else if (this.prodOptions[index] != this.prodOptions[i]) {
        if (this.prodOptions[index].values.toLowerCase().trim() == this.prodOptions[i].values.toLowerCase().trim()) {
          this.matchOption_values = true;
        } else {
          this.matchOption_values = false;
        }
      }
    }
    if (this.matchOption_values) {
      this.toast.error(this.prodOptions[index].values + ' is alreday exist Duplicate is not Allowed', '', {
        timeOut: 1500,
        positionClass: 'toast-bottom-left',
        progressBar: true,
        progressAnimation: 'increasing'
      });
    }
  }

  removeTags(i, j) {
    this.prodOptions[i].options.splice(j, 1);
    this.createCombination();
  }

  upload(event) {
    var file = event.target.files[0];
    var inc = 0;
    this.uploadSrv.saveimage(file).subscribe((data: any) => {
      console.log(data);
      var incid = inc++;
      this.multiImages.push({ id: incid, image: data });
    });
  }

  image_options(event) {
    if (event.target.files[0].type == 'image/jpeg' || event.target.files[0].type == 'image/png') {
      let file = event.target.files[0];
      this.uploadSrv.saveimage(file).subscribe((data: any) => {
        this.ObjForm.picture = data;
      });
    } else {
      var str = event.target.files[0].type;
      var splitted = str.split("/", 2);
      let BadUrlMsg = splitted[0];

      this.toast.error(BadUrlMsg + ' is not allowed', '', {
        timeOut: 2000,
        positionClass: 'toast-bottom-left',
        progressBar: true,
        progressAnimation: 'increasing'
      });
    }
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
    console.log(this.formObj);
    // return;
    this.formObj.combinations = this.cominations;
    this.formObj.productoptions = this.prodOptions;
    this.formObj.image = this.multiImages;
    if (
      this.formObj.title === '' ||
      this.formObj.price === '' ||
      this.formObj.image.length < 1
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
