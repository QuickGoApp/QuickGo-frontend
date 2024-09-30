import {Component, OnInit} from '@angular/core';
import * as XLSX from 'xlsx';
import {DriverDetailModel} from "../../../../api-service/model/DriverDetailModel";
import {TripService} from "../../../../api-service/service/TripService";  // For Excel export

@Component({
  selector: 'app-driver-report',
  templateUrl: './driver-report.component.html',
  styleUrls: ['./driver-report.component.scss']
})
export class DriverReportComponent {
  drivers:DriverDetailModel[] = [];
  fromDate: string;
  toDate: string;

  constructor(private tripService:TripService) {
  }

  getDriverReport(payload: any): void {

    this.tripService.getDriverReport(payload).subscribe(value => {
      if (value.statusCode === 200) {
        this.drivers = value.data;
      } else {
        console.error('Failed to load driver data');
      }
    })

  }
  // Search functionality based on the filter
  searchTripReports(): void {
    const payload = {
      fromDate: this.fromDate,
      toDate: this.toDate
    };
    this.getDriverReport(payload);
  }

  // Excel export function
  exportToExcel(): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.drivers);
    const workbook: XLSX.WorkBook = {
      Sheets: { 'Driver Report': worksheet },
      SheetNames: ['Driver Report']
    };
    XLSX.writeFile(workbook, 'Driver_Report.xlsx');
  }
}
