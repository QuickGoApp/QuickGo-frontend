import {Component, OnDestroy, OnInit} from '@angular/core';
import {routes} from "../../../core/routes-path/routes";
import {Loader} from "@googlemaps/js-api-loader";
import {TripService} from "../../../../api-service/service/TripService";
import {ApiResultFormatModel} from "../../../../api-service/model/common/ApiResultFormatModel";
import Swal from "sweetalert2";
import {DriverService} from "../../../../api-service/service/DriverService";

@Component({
  selector: 'app-driver-home-page',
  templateUrl: './driver-home-page.component.html',
  styleUrls: ['./driver-home-page.component.scss']
})
export class DriverHomePageComponent implements OnInit, OnDestroy {

  protected readonly routes = routes;
  public totalPrice;
  public isNotification = true;

  private map!: google.maps.Map;
  private directionsService!: google.maps.DirectionsService;
  private directionsRenderer!: google.maps.DirectionsRenderer;
  private geocoder!: google.maps.Geocoder;

  private geoLocationLat;
  private geoLocationLng;

  private locationInterval: any;  // Interval to fetch geolocation


  notifications: any[] = [];

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor(private tripService: TripService, private driverService: DriverService) {
  }

  ngOnInit(): void {
    this.initializeGoogleMaps();
    this.loadNotification();
    // Start interval to save driver geolocation every 10 seconds
    this.startGeoLocationInterval();
  }

  ngOnDestroy(): void {
    // Stop the interval when component is destroyed
    if (this.locationInterval) {
      clearInterval(this.locationInterval);
    }
  }

  private initializeGoogleMaps() {

    const loader = new Loader({
      // apiKey: 'AIzaSyCaKbVhcX_22R_pRKDYuNA7vox-PtGaDkI',
      apiKey: 'AIzaSyCh4WBNFwhN5o3XuU4lLQ43sRLPGy0WSS0',
      version: 'weekly',
      libraries: ['places']
    });

    loader.load().then(() => {
      this.map = new google.maps.Map(document.getElementById('map') as HTMLElement, {
        center: {lat: 7.8731, lng: 80.7718},
        zoom: 11
      });

      // Get the current location
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          const currentLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };

          this.geoLocationLat = position.coords.latitude;
          this.geoLocationLng = position.coords.longitude
          // Center the map on the current location
          this.map.setCenter(currentLocation);

          // Place a marker on the current location
          new google.maps.Marker({
            position: currentLocation,
            map: this.map,
            title: "You are here"
          });

          // Call saveDriverGeoLocation and pass the geolocation values
          this.saveDriverGeoLocation(this.geoLocationLat, this.geoLocationLng);
        }, () => {
          // Handle location error
          console.error('Error getting location');
        });
      } else {
        console.error('Geolocation is not supported by this browser.');
      }

      this.directionsService = new google.maps.DirectionsService();
      this.directionsRenderer = new google.maps.DirectionsRenderer();
      this.directionsRenderer.setMap(this.map);

      this.geocoder = new google.maps.Geocoder();
    }).catch(error => {
      console.error('Error loading Google Maps:', error);
    });
  }

  private startGeoLocationInterval() {
    // Check if geolocation is available and start saving the driver's location every 10 seconds
    if (navigator.geolocation) {
      this.locationInterval = setInterval(() => {
        navigator.geolocation.getCurrentPosition((position) => {
          this.geoLocationLat = position.coords.latitude;
          this.geoLocationLng = position.coords.longitude;

          // Call saveDriverGeoLocation with the updated geolocation
          this.saveDriverGeoLocation(this.geoLocationLat, this.geoLocationLng);
        }, (error) => {
          console.error('Error getting updated location:', error);
        });
      }, 10000);  // 10000 milliseconds = 10 seconds
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }


  loadNotification() {
    const payload = {
      driverCode: sessionStorage.getItem("userId"),
    }
    this.tripService.getDriverTrip(payload).subscribe((response: ApiResultFormatModel) => {
      if (response.statusCode === 200) {
        // Map the response data to notifications array
        this.notifications = response.data.map((trip: any) => ({
          tripID: trip.tripID,
          passengerCode: trip.passengerCode,
          driveCode: trip.driveCode,
          totalAmount: trip.totalAmount,
          paymentMethod: trip.paymentMethod,
          status: trip.status,
          driverComment: trip.driverComment,
          pickupLat: trip.pickupLat,
          pickupLng: trip.pickupLng,
          dropLat: trip.dropLat,
          dropLng: trip.dropLng,
          passengerComment: trip.passengerComment,
          createDateTime: trip.createDateTime,
          updateDateTime: trip.updateDateTime,
          isActive: trip.isActive,
          title: 'New Ride Notification',  // Custom hardcoded title
          message: 'A new ride request from Passenger ',
        }));
      } else {
        Swal.fire({
          title: 'Error!',
          text: 'Something went wrong',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    });
  }


  public acceptNotification(index: number) {
    this.isNotification = false;
    console.log('Notification accepted:', this.notifications[index]);
    const notification = this.notifications[index];

    // Get the pickup and drop-off coordinates from the notification
    const pickupLat = notification.pickupLat;
    const pickupLng = notification.pickupLng;
    const dropLat = notification.dropLat;
    const dropLng = notification.dropLng;

    // Center the map on the pickup location
    const pickupLocation = {lat: pickupLat, lng: pickupLng};
    const dropLocation = {lat: dropLat, lng: dropLng};

    // Request directions from the pickup to drop-off
    const directionsRequest = {
      origin: pickupLocation,
      destination: dropLocation,
      travelMode: google.maps.TravelMode.DRIVING
    };

    this.directionsService.route(directionsRequest, (result, status) => {
      if (status === google.maps.DirectionsStatus.OK) {
        this.directionsRenderer.setDirections(result);
      } else {
        console.error('Directions request failed due to ' + status);
        Swal.fire({
          title: 'Error!',
          text: 'Could not get directions. Please try again.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    });

    this.totalPrice = notification.totalPrice.toFixed(2);
  }


  public cancelNotification(index: number) {
    console.log('Notification cancelled:', this.notifications[index]);
    // Handle cancel logic here
  }

  public stopTrip() {
    this.isNotification = true;

    this.loadNotification();

    console.log('Trip stopped:', this.notifications[1]);

    const notification = this.notifications[1];

    // Assuming there's a backend call to stop the trip or handle the logic
    // For demonstration purposes, we'll just set the status to 'COMPLETED' locally

    notification.status = 'COMPLETED'; // You might also update the backend here

    // You can display a message or alert to the user about the trip status
    Swal.fire({
      title: 'Trip Stopped',
      text: 'The trip has been successfully stopped.',
      icon: 'success',
      confirmButtonText: 'OK'
    });


  }


  private saveDriverGeoLocation(latitude: number, longitude: number) {
    const payload = {
      driverId: sessionStorage.getItem("userId"),
      latitude: latitude,
      longitude: longitude
    };

    console.log("Saving geolocation:", latitude, longitude);

    this.driverService.saveDriverGeoLocation(payload).subscribe(value => {
      console.log("Geo-location saved successfully.");
    });
  }

}
