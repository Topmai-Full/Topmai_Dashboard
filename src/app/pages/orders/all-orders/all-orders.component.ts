import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { OrderService } from '../../../Services/order.service';
import { ToastrService } from 'ngx-toastr';
import { NgbDate, NgbCalendar, ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import { environment } from '../../../../environments/environment.prod';

@Component({
  selector: 'app-all-orders',
  templateUrl: './all-orders.component.html',
  styleUrls: ['./all-orders.component.scss']
})

export class AllOrdersComponent implements OnInit {

  loader = false;
  orderLoader = false;
  allOrders: any;
  products: any;
  singleOrder: any;
  baseUrl = environment.baseurl;
  user = JSON.parse(localStorage.getItem('user'));
  OrderId: any;
  key = 'id';
  reverse: boolean = false;
  searchText;
  GetSelectData: any;
  activityLoader = false;
  //Decalre ngModel order status veriable
  OrderStatus: any;
  orderActiviti = [];
  masterOrders: any;
  config = {
    itemsPerPage: 10,
    currentPage: 1,
    totalItems: ''
  };

  constructor(
    private tabtitle: Title,
    private orderSrv: OrderService,
    private toast: ToastrService,
    public datepipe: DatePipe,
    private modalService: NgbModal
  ) { }

  sort(key) {
    this.key = key;
    this.reverse = !this.reverse;
  }

   open(content, options = {}) {
    this.modalService.open(content, options).result.then((result) => {
    }, (reason) => {
      console.log(`Dismissed ${this.getDismissReason(reason)}`);
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }

  ngOnInit(): void {
    this.tabtitle.setTitle('Cartium | All Orders')
    this.loader = true;
    this.GetSelectData = 'All';
    this.get();
  }

  get() {
    this.orderSrv.getAll().subscribe((resp: any) => {
      this.allOrders = resp.data;
      this.masterOrders = resp.data;
      this.loader = false;
    });
  }

  pageChanged(event) {
    this.config.currentPage = event;
  }

  extractNameFromJson(obj) {
    obj = JSON.parse(obj);
    return obj;
  }

  //Get Products against order id
  getProductsbyOrderId(id, status) {
    this.OrderId = id;
    this.orderSrv.getallOrderProducts(this.OrderId).subscribe((data: any) => {
      this.products = data.products;
      this.singleOrder = data.ord;
      this.OrderStatus = this.singleOrder.status;
    });
  }

  //Get Order Activity
  orderActivity(id) {
    this.activityLoader = true;
    this.orderSrv.getall_OrderActivity(id).subscribe((data: any) => {
      this.orderActiviti = data.data;
      this.activityLoader = false;
    })
  }

  SaveNow() {
    var Obj = { status: this.OrderStatus, order: this.OrderId };
    this.orderSrv.changeOrderstatus2(Obj).subscribe((data: any) => {
      if (data.message == 'success') {
        this.get();
        this.toast.success('Order status updatede', '', {
          timeOut: 2000,
          positionClass: 'toast-bottom-left',
          progressBar: true,
          progressAnimation: 'increasing'
        });
      } else {
        console.log('error in order status changed.')
      }
    })
  }

}
