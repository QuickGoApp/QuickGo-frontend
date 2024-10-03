import {Component} from '@angular/core';
import {TripService} from "../../../../api-service/service/TripService";
import {TripReportModel} from "../../../../api-service/model/TripReportModel";
import {saveAs} from "file-saver";
import * as XLSX from 'xlsx';
import Swal from "sweetalert2";

@Component({
  selector: 'app-trip-report',
  templateUrl: './trip-report.component.html',
  styleUrls: ['./trip-report.component.scss']
})
export class TripReportComponent {
  fromDate: Date = new Date(); // Initialize current date
  toDate: Date = new Date();   // Initialize current date
  driverCode = 'ALL';     // Initialize empty driver code
  passengerCode = 'ALL';     // Initialize empty driver code
  status = 'ALL';         // Initialize empty status
  tripReports: TripReportModel[] = []; // Store fetched trip reports

  constructor(private tripService: TripService) {
    if (sessionStorage.getItem("role") == "ROLE_ADMIN" || sessionStorage.getItem("role") == "ROLE_TELEPHONE_OPERATOR") {
      this.driverCode = "ALL";
      this.passengerCode = "ALL";
    } else if (sessionStorage.getItem("role") == "ROLE_DRIVER") {
      this.driverCode = sessionStorage.getItem("userId");

    } else if (sessionStorage.getItem("role") == "ROLE_PASSENGER") {
      this.passengerCode = sessionStorage.getItem("userId");
    }
  }

  // Method to search trip reports
  searchTripReports() {
    // Create a payload object for the request
    const payload = {
      fromDate: this.fromDate,
      toDate: this.toDate,
      driverCode: this.driverCode,
      passengerCode: this.passengerCode,
      status: this.status
    };

    // Call the trip service method to fetch reports
    this.tripService.getTripReport(payload).subscribe(
      (response) => {
        if (response.statusCode === 200) {
          this.tripReports = response.data; // Update tripReports array with data
        } else {
          Swal.fire('Error', response.message, 'error');
          console.error('Error: Failed to fetch reports', response);
        }
      },
      (error) => {
        Swal.fire('Error', 'Error fetching trip reports', 'error');
        console.error('Error fetching trip reports', error);
      }
    );
  }

  // Method to export trip reports to Excel
  exportToExcel() {
    if (this.tripReports.length === 0) {
      Swal.fire('Error', 'No data available to export', 'error');
      return;
    }
    // Convert the tripReports array to a worksheet
    const worksheet = XLSX.utils.json_to_sheet(this.tripReports);

    // Create a new workbook
    const workbook = XLSX.utils.book_new();

    // Append the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Trip Reports');

    // Generate a buffer for the Excel file
    const excelBuffer = XLSX.write(workbook, {bookType: 'xlsx', type: 'array'});

    // Create a blob from the buffer and trigger the download
    this.saveAsExcelFile(excelBuffer, 'Trip_Report');
  }

  // Method to save the Excel file using file-saver
  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {type: EXCEL_TYPE});
    saveAs(data, `${fileName}_${new Date().getTime()}.xlsx`);
  }

}

// MIME type for Excel files
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
