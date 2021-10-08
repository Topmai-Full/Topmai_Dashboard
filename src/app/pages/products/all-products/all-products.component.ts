import { Component, OnInit, ViewChild } from '@angular/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { AppService } from '../../../app.service';
import { ProductService } from '../../../services/product.service';
import { environment } from '../../../../environments/environment.prod';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import swal from 'sweetalert'
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-all-products',
  templateUrl: './all-products.component.html',
  styleUrls: ['./all-products.component.scss']
})
export class AllProductsComponent implements OnInit {

  products: any;
  searchText = '';
  baseUrl = environment.baseurl;

  constructor(
    private appService: AppService,
    private productSrv: ProductService,
    private modalService: NgbModal,
    private toast: ToastrService
  ) {
    this.appService.pageTitle = 'All Products';
  }

  ngOnInit() {
    this.productSrv.getAll().subscribe((resp: any) => {
      this.products = resp.data;
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
        this.productSrv.delete(id).subscribe((resp: any) => {
          console.log(resp)
          if (resp.message == 'success') {
            this.productSrv.getAll().subscribe((resp: any) => {
              this.products = resp.data;
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
