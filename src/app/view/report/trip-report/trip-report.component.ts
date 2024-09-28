import { Component } from '@angular/core';

@Component({
  selector: 'app-trip-report',
  templateUrl: './trip-report.component.html',
  styleUrls: ['./trip-report.component.scss']
})
export class TripReportComponent {
  fromDate: any;

  constructor() {
    this.fromDate= new  Date();
  }

}
