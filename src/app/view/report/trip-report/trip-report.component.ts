import { Component } from '@angular/core';
import {TripReportModel} from "../../../../api-service/model/TripReportModel";

@Component({
  selector: 'app-trip-report',
  templateUrl: './trip-report.component.html',
  styleUrls: ['./trip-report.component.scss']
})
export class TripReportComponent {
  fromDate: Date = new Date();
  toDate: Date = new Date();
  driverCode  = '';
  status  = '';
  tripReports: TripReportModel[] = []; // Array to store trip reports


  constructor() {
    this.fromDate= new  Date();
  }


}
