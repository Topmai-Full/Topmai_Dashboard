import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { AppService } from '../../app.service';
import { LayoutService } from '../../layout/layout.service';
import { BaseChartDirective } from 'ng2-charts/ng2-charts';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {


  isRTL: boolean;
  userData: any;
  date = new Date();
  user = JSON.parse(localStorage.getItem('user'));

  constructor(
    private appService: AppService,
    private layoutService: LayoutService,
    private authStv: AuthService
  ) {
    this.appService.pageTitle = 'Dashboard';
    this.isRTL = appService.isRTL;
  }

  ngOnInit() {
    this.authStv.getById(this.user._id).subscribe((resp: any) => {
      this.userData = resp.data;
    })
  }


  // Chart 1
  //

  chart1Data = [{
    data: [24, 92, 77, 90, 91, 78, 28, 49, 23, 81, 15, 97, 94, 16, 99, 61,
      38, 34, 48, 3, 5, 21, 27, 4, 33, 40, 46, 47, 48, 18
    ],
    borderWidth: 0
  }];
  chart1Options = {
    scales: {
      xAxes: [{
        display: false,
      }],
      yAxes: [{
        display: false
      }]
    },
    legend: {
      display: false
    },
    responsive: false,
    maintainAspectRatio: false
  };
  chart1Colors = [{
    backgroundColor: 'rgba(87, 181, 255, 1)'
  }];


  // Chart 2
  //

  chart2Data = [{
    data: [24, 92, 77, 90, 91, 78, 28, 49, 23, 81, 15, 97, 94, 16, 99, 61,
      38, 34, 48, 3, 5, 21, 27, 4, 33, 40, 46, 47, 48, 18
    ],
    borderWidth: 1,
    pointRadius: 1,
    lineTension: 0
  }];
  chart2Options = {
    scales: {
      xAxes: [{
        display: false,
      }],
      yAxes: [{
        display: false
      }]
    },
    legend: {
      display: false
    },
    responsive: false,
    maintainAspectRatio: false
  };
  chart2Colors = [{
    backgroundColor: 'rgba(0,0,0,0)',
    borderColor: '#009688',
    pointBorderColor: 'rgba(0,0,0,0)'
  }];


  // Chart 3
  //

  chart3Data = [{
    data: [54, 46],
    borderWidth: 0
  }];
  chart3Options = {
    scales: {
      xAxes: [{
        display: false,
      }],
      yAxes: [{
        display: false
      }]
    },
    legend: {
      display: false
    },
    tooltips: {
      enabled: false
    },
    cutoutPercentage: 94,
    responsive: false,
    maintainAspectRatio: false
  };
  chart3Colors = [{
    backgroundColor: ['#673AB7', '#f9f9f9'],
    hoverBackgroundColor: ['#673AB7', '#f9f9f9']
  }];

  // Resize charts
  //

  @ViewChildren(BaseChartDirective) charts: QueryList<BaseChartDirective>;

  ngAfterViewInit() {
    setTimeout(() => {
      const resizeCharts = () => this.charts.forEach(chart => chart.chart.resize());

      // Initial resize
      resizeCharts();

      // For performance reasons resize charts on delayed resize event
      this.layoutService.on('resize.dashboard-2', resizeCharts);
    });
  }

  ngOnDestroy() {
    setTimeout(() => this.layoutService.off('resize.dashboard-2'));
  }


}
