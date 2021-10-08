import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../environments/environment';
import { AppService } from '../../app.service';
import { ContactUsService } from '../../services/contact-us.service';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss']
})
export class ContactUsComponent implements OnInit {

  contactUs: any;
  searchText = '';
  baseUrl = environment.baseurl;

  constructor(
    private appService: AppService,
    private contactSrv: ContactUsService,
    private modalService: NgbModal,
    private toast: ToastrService
  ) {
    this.appService.pageTitle = 'Contact Us';
  }

  ngOnInit() {
    this.contactSrv.getAll().subscribe((resp: any) => {
      this.contactUs = resp.data;
    })
  }

}
