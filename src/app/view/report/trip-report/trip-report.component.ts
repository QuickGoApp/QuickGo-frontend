import { Component } from '@angular/core';
import {TripService} from "../../../../api-service/service/TripService";
import {TripReportModel} from "../../../../api-service/model/TripReportModel";

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
  status = '';         // Initialize empty status
  tripReports: TripReportModel[] = []; // Store fetched trip reports

  constructor(private tripService: TripService) {}

  // Method to search trip reports
  searchTripReports() {
    // Create a payload object for the request
    const payload = {
      fromDate: this.fromDate,
      toDate: this.toDate,
      driverCode: this.driverCode,
      passengerCode:this.passengerCode,
      status: this.status
    };

    // Call the trip service method to fetch reports
    this.tripService.getTripReport(payload).subscribe(
      (response) => {
        if (response.statusCode === 200) {
          this.tripReports = response.data; // Update tripReports array with data
        } else {
          console.error('Error: Failed to fetch reports', response);
        }
      },
      (error) => {
        console.error('Error fetching trip reports', error);
      }
    );
  }
}
