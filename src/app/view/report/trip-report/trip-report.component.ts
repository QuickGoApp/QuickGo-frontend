import { Component } from '@angular/core';
import { TripReportRequestModel } from 'src/api-service/model/report/TripReportRequestModel';
import { ReportService } from 'src/api-service/service/ReportService';

@Component({
  selector: 'app-trip-report',
  templateUrl: './trip-report.component.html',
  styleUrls: ['./trip-report.component.scss']
})
export class TripReportComponent {
  fromDate: any;
  trips = [];

  constructor(private reportService: ReportService) {
    this.fromDate= new  Date();
    this.getTripReport();
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
      } 
    });
  }

}
