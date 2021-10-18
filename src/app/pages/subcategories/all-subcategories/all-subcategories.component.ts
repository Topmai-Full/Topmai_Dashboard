import { CategoryService } from './../../../services/category.service';
import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../../environments/environment';
import { AppService } from '../../../app.service';
import { ProductService } from '../../../services/product.service';
import swal from 'sweetalert'
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-all-subcategories',
  templateUrl: './all-subcategories.component.html',
  styleUrls: ['./all-subcategories.component.scss']
})
export class AllSubcategoriesComponent implements OnInit {


  Subcategories: any;
  mainCategory: any;
  searchText = '';
  baseUrl = environment.baseurl;
  routerId: any;
  constructor(
    private appService: AppService,
    private categorySrv: CategoryService,
    private modalService: NgbModal,
    private toast: ToastrService,
    private _route: ActivatedRoute
  ) {
    this.appService.pageTitle = 'All Sub Categories';
  }

  ngOnInit() {
    this.routerId = this._route.snapshot.params['id'];
    this.categorySrv.getById(this.routerId).subscribe((resp: any) => {
      this.mainCategory = resp.data;
    })

    this.categorySrv.getAllSub(this.routerId).subscribe((resp: any) => {
      this.Subcategories = resp.data;
    })
  }

  delete(id) {
    swal('Are you sure, you want to delete it?', {
      icon: 'warning',
      closeOnClickOutside: false,
      closeOnEsc: false,
      buttons: {
        catch: {
          text: 'No',
          value: 'catch',
          closeModal: false,
        },
        yes: {
          closeModal: false,
        },
      },
    }).then((value) => {
      if (value === 'yes') {
        this.categorySrv.delete(id).subscribe((resp: any) => {
          if (resp.message == 'success') {
            this.categorySrv.getAllSub(this.routerId).subscribe((resp: any) => {
              this.Subcategories = resp.data;
            })
            this.toast.success('Deleted successfully', '', {
              timeOut: 2000,
              positionClass: 'toast-top-right',
              progressBar: true,
              progressAnimation: 'increasing',
            })
            swal.close()
          } else {
            console.log('something went wrong')
          }
        })

      } else swal.close()
    })

  }

}
