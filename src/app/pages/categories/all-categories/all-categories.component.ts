import { CategoryService } from './../../../services/category.service';
import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../../environments/environment';
import { AppService } from '../../../app.service';
import { ProductService } from '../../../services/product.service';
import swal from 'sweetalert'

@Component({
  selector: 'app-all-categories',
  templateUrl: './all-categories.component.html',
  styleUrls: ['./all-categories.component.scss']
})
export class AllCategoriesComponent implements OnInit {

  categories: any;
  searchText = '';
  baseUrl = environment.baseurl;

  constructor(
    private appService: AppService,
    private categorySrv: CategoryService,
    private modalService: NgbModal,
    private toast: ToastrService
  ) {
    this.appService.pageTitle = 'All Categories';
  }

  ngOnInit() {
    this.categorySrv.getAll().subscribe((resp: any) => {
      this.categories = resp.data;
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
          console.log(resp)
          if (resp.message == 'success') {
            this.categorySrv.getAll().subscribe((resp: any) => {
              this.categories = resp.data;
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
