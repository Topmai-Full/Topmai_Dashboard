import { Component, OnInit } from '@angular/core';
import { AppService } from '../../app.service';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../environments/environment.prod';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  user = JSON.parse(localStorage.getItem('user'));
  userData: any;
  baseUrl = environment.baseurl;

  constructor(
    private appService: AppService,
    private authStv: AuthService,
  ) {
    this.appService.pageTitle = 'Profile';
  }

  ngOnInit() {
    this.authStv.getById(this.user._id).subscribe((resp: any) => {
      this.userData = resp.data;
    })
  }

  socialShare(media, url) {
    url = this.userData._id;
    // window.open(`https://www.facebook.com/sharer/sharer.php?u=https://www.youtube.com/watch?v=IdByOJh71Ik`);
    switch (media) {
      case 'fb':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`);
        break;
      case 'tw':
        window.open(`https://twitter.com/home?status=${url}`);
        break;
      case 'pn':
        window.open(`https://www.pinterest.com/pin/find/?url=${url}`);
        break;
      case 'in':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`);
        break;
      case 'tr':
        window.open(`https://www.tumblr.com/widgets/share/tool?canonicalUrl=${url}`);
        break;
      case 'dg':
        window.open(`http://digg.com/submit?url=${url}`);
        break;
      case 'rd':
        window.open(`https://reddit.com/submit?url=${url}`);
        break;
      default:
        break;
    }
  }

}
