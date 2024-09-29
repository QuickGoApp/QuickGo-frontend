import { Component, ViewChild } from '@angular/core';
import { Sort } from '@angular/material/sort';
import {
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexPlotOptions,
  ApexYAxis,
  ApexXAxis,
  ApexResponsive,
  ApexLegend,
  ApexFill,
} from 'ng-apexcharts';
import { TripReportRequestModel } from 'src/api-service/model/report/TripReportRequestModel';
import { DashboardService } from 'src/api-service/service/DashboardService';
import { ReportService } from 'src/api-service/service/ReportService';
import { SettingsService } from 'src/app/core/core.index';

export type ChartOptions = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  series: ApexAxisChartSeries | any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  chart: ApexChart | any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  responsive: ApexResponsive | any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  colors: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dataLabels: ApexDataLabels | any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  plotOptions: ApexPlotOptions | any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  yaxis: ApexYAxis | any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  xaxis: ApexXAxis | any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  legend: ApexLegend | any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fill: ApexFill | any;
};
import { routes } from 'src/app/core/routes-path/routes';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  public routes = routes;

  @ViewChild('chart') chart!: ChartComponent;

  public totalDrivers = 0;
  public totalPassengers = 0;
  public totalActiveTrips = 0;
  public totalCompletedTrips = 0;

  public trips = [];


  public chartOptions: Partial<ChartOptions>;
  public currency!: string;
  public recentlyAddedProducts = [
    {
      Sno: '1',
      img: 'assets/img/product/product22.jpg',
      Products: 'Apple Earpods',
      Price: 899,
    },
    {
      Sno: '2',
      img: 'assets/img/product/product23.jpg',
      Products: 'iPhone 11',
      Price: 668.51,
    },
    {
      Sno: '3',
      img: 'assets/img/product/product24.jpg',
      Products: 'samsung',
      Price: 5,
    },
    {
      Sno: '4',
      img: 'assets/img/product/product6.jpg',
      Products: 'Macbook Pro',
      Price: 29.01,
    },
  ];

  public expiredProducts = [
    {
      SNo: '1',
      ProductCode: 'IT0001',
      ProductName: 'Test',
      img: 'assets/img/product/product2.jpg',
      BrandName: 'N/D',
      CategoryName: 'Fruits',
      ExpiryDate: '12-12-2022',
    },
    {
      SNo: '2',
      ProductCode: 'IT0002',
      ProductName: 'Test',
      img: 'assets/img/product/product3.jpg',
      BrandName: 'N/D',
      CategoryName: 'Fruits',
      ExpiryDate: '25-11-2022',
    },
    {
      SNo: '3',
      ProductCode: 'IT0003',
      ProductName: 'Test',
      img: 'assets/img/product/product4.jpg',
      BrandName: 'N/D',
      CategoryName: 'Fruits',
      ExpiryDate: '19-11-2022',
    },
    {
      SNo: '4',
      ProductCode: 'IT0004',
      ProductName: 'Test',
      img: 'assets/img/product/product5.jpg',
      BrandName: 'N/D',
      CategoryName: 'Fruits',
      ExpiryDate: '20-11-2022',
    },
  ];

  constructor(private setting: SettingsService, private dashboardService: DashboardService, private reportService: ReportService) {
    this.chartOptions = {
      series: [
        {
          name: 'Sales',
          color: '#EA5455',
          data: [50, 45, 60, 70, 50, 45, 60, 70],
        },
        {
          name: 'Purchase',
          color: '#28C76F',
          data: [-21, -54, -45, -35, -21, -54, -45, -35],
        },
      ],
      chart: {
        type: 'bar',
        height: 300,
        stacked: true,
        zoom: {
          enabled: true,
        },
      },

      responsive: {
        breakpoint: 280,
        options: {
          legend: {
            position: 'bottom',
            offsetY: 0,
          },
        },
      },
      plotOptions: {
        area: {
          fillTo: 'end',
        },
        bar: {
          horizontal: false,
          columnWidth: '20%',
          borderRadius: 7,
          borderRadiusApplication: 'end',
          borderRadiusWhenStacked: 'all',
          distributed: true,
          colors: {
            ranges: [
              {
                from: 0,
                to: 100000,
                color: '#28C76F',
              },
              {
                from: -100000,
                to: 0,
                color: '#EA5455',
              },
            ],
          },
        },
      },
      xaxis: {
        categories: [
          ' Jan ',
          'feb',
          'march',
          'april',
          'may',
          'june',
          'july',
          'auguest',
        ],
      },

      legend: {
        position: 'right',
        offsetY: 40,
      },
      fill: {
        opacity: 1,
      },
    };
    this.getDashboardAnalytics();
    this.getTripReport();

  }

  private getDashboardAnalytics() {
    this.dashboardService.getDashboardAnalytics().subscribe((data) => {
      if (data.statusCode === 200) {
        this.totalDrivers = data.data.totalDrivers;
        this.totalPassengers = data.data.totalPassengers;
        this.totalActiveTrips = data.data.totalActiveTrips;
        this.totalCompletedTrips = data.data.totalCompletedTrips;
      } else {
        Swal.fire('Error', data.message, 'error');
      }
    });
  }

  private getTripReport() {

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const payload = new TripReportRequestModel(
      startOfDay,
      endOfDay,
      'ALL',
      'ALL',
      'ALL'
    );

    this.reportService.getTripReport(payload).subscribe((data) => {
      if (data.statusCode === 200) {
        this.trips = data.data;
      } else {
        Swal.fire('Error', data.message, 'error');
      }
    });
  }


  public sortRecentlyAddedProducts(sort: Sort) {
    const data = this.recentlyAddedProducts.slice();

    if (!sort.active || sort.direction === '') {
      this.recentlyAddedProducts = data;
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this.recentlyAddedProducts = data.sort((a: any, b: any) => {
        const aValue = a[sort.active];
        const bValue = b[sort.active];
        return (aValue < bValue ? -1 : 1) * (sort.direction === 'asc' ? 1 : -1);
      });
    }
  }
  public sortExpiredProducts(sort: Sort) {
    const data = this.expiredProducts.slice();

    if (!sort.active || sort.direction === '') {
      this.expiredProducts = data;
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this.expiredProducts = data.sort((a: any, b: any) => {
        const aValue = a[sort.active];
        const bValue = b[sort.active];
        return (aValue < bValue ? -1 : 1) * (sort.direction === 'asc' ? 1 : -1);
      });
    }
  }
}
