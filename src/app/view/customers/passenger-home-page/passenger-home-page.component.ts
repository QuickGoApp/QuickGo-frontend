import {Component, OnInit} from '@angular/core';
import {routes} from "../../../core/routes-path/routes";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Loader} from '@googlemaps/js-api-loader';
import {DriverService} from "../../../../api-service/service/DriverService";
import Swal from "sweetalert2";
import {ApiResultFormatModel} from "../../../../api-service/model/common/ApiResultFormatModel";  // Make sure this is from '@googlemaps/js-api-loader'

@Component({
  selector: 'app-home-page',
  templateUrl: './passenger-home-page.component.html',
  styleUrls: ['./passenger-home-page.component.scss']
})
export class PassengerHomePageComponent implements OnInit {

  protected readonly routes = routes;
  locationForm: FormGroup;
  activeVehicle: string | null = null; // Track selected vehicle
  submittedCart: any = null; // Store the submitted cart details

  public vehicleTypes = [];
  public isLoader = false;
  private activeVehicleLocations = [];
  private pickupLatLng = {lat: null, lng: null};
  private dropLatLng = {lat: null, lng: null};

  private map!: google.maps.Map;
  private directionsService!: google.maps.DirectionsService;
  private directionsRenderer!: google.maps.DirectionsRenderer;
  private geocoder!: google.maps.Geocoder;
  private userLocationCircle!: google.maps.Circle; // To store the circle object


  public pricePerKm = 0;


  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor(private driverService: DriverService) {
    this.locationForm = new FormGroup({
      pickupLocation: new FormControl('', [Validators.required]),
      dropLocation: new FormControl('', [Validators.required]),
      vehicleType: new FormControl('', [Validators.required]),
      totalPrice: new FormControl('',),
      distanceKm: new FormControl('',),
      contactNumber: new FormControl('', [
        Validators.required,
        Validators.pattern('^\\+?\\d{10,15}$') // Example regex to validate phone numbers
      ])
    });
    console.log(sessionStorage.getItem("userId"));

    this.loadSelectVehicleType();
  }

  ngOnInit(): void {
    this.initializeGoogleMaps();
  }

  // form vehicles load
  private loadSelectVehicleType() {
    this.driverService.getVehicleTypes().subscribe(
      (data) => {
        if (data.statusCode === 200) {
          // Assuming the API returns the 'coordinates', 'name', and 'icon' fields directly
          this.vehicleTypes = data.data.map((vehicle: any) => {
            return {
              type: vehicle.type,
              name: vehicle.name,
              imageUrl: vehicle.imageUrl
            };
          });

        } else {

          Swal.fire({
            title: 'warning!',
            text: 'vehicle Type cannot be shown.!',
            icon: 'warning',
            confirmButtonText: 'OK'
          });
        }
      },
      (error) => {
        Swal.fire(
          'Error',
          error.error.message,
          'error'
        );
      }
    );
  }

  onVehicleSelect(type: string): void {
    // Toggle the selected vehicle (select/deselect)
    if (this.activeVehicle === type) {
      this.activeVehicle = null; // Deselect if clicked again
      this.locationForm.get('vehicleType')?.setValue('');
    } else {
      this.activeVehicle = type; // Select the vehicle
      this.locationForm.get('vehicleType')?.setValue(type);
    }
  }

// google map set
  private initializeGoogleMaps(): void {
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

      this.directionsService = new google.maps.DirectionsService();
      this.directionsRenderer = new google.maps.DirectionsRenderer();
      this.directionsRenderer.setMap(this.map);

      this.geocoder = new google.maps.Geocoder();


    }).catch(error => {
      console.error('Error loading Google Maps:', error);
    });
  }

  public setCurrentLocation(): void {
    this.clearMap();
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

          this.map.setCenter(userLocation);
          new google.maps.Marker({
            position: userLocation,
            map: this.map,
            title: 'Your Location'
          });

          // Set the pickup location field with the user's current location
          this.geocodeLatLng(userLocation);
          // Center the map on the pickup location and set a zoom level
          this.map.setCenter(userLocation);
          this.map.setZoom(12);  // Adjust the zoom level as needed
        },
        () => {
          console.warn('Geolocation failed or was denied by the user. Showing default location.');
        }
      );
    } else {
      console.warn('Geolocation is not supported by this browser. Showing default location.');
    }
  }


//set location
  private geocodeLatLng(latLng: google.maps.LatLng): void {
    this.geocoder.geocode({location: latLng}, (results, status) => {
      if (status === 'OK') {
        if (results[0]) {
          this.locationForm.get('pickupLocation')?.setValue(results[0].formatted_address);
        } else {
          console.log('No results found');
        }
      } else {
        console.error('Geocoder failed due to: ' + status);
      }
    });
  }


  onSubmit(): void {
    this.isLoader = true;
    setTimeout(() => {
      this.isLoader = false;
    }, 5000); // 5 seconds

    // reload the map
    this.initializeGoogleMaps();

    if (this.locationForm.valid) {
      const {pickupLocation} = this.locationForm.value;

      // Geocode the pickup location and focus the map on it
      this.geocodePickupLocationAndFocusMap(pickupLocation);
      this.geocodeLocations();

      // Call the recursive function to get drivers and their location
      //this.driversAndLocation();

        this.driverAndLocationDetails();


    } else {
      console.log('Form is invalid');
    }
  }

  driversAndLocation(): void {
    const passenger = {
      latitude: this.pickupLatLng.lat,
      longitude: this.pickupLatLng.lng,
      radius: 2000, // Set radius to 5000 as per your requirement
    };

    this.driverService.getDriversAndLocation(passenger).subscribe((response) => {
      console.log('API Response:', response);

      // If response data is not empty, stop the polling
      if (response && response.data && response.data.length > 0) {
        console.log('Valid response received. Stopping further calls.');
        return;
      }

      // If the response is empty, wait 30 seconds and try again
      console.log('No valid response. Retrying in 30 seconds...');
      setTimeout(() => {
        passenger.radius = 5000;
        this.driversAndLocation();  // Recursive call after 30 seconds
      }, 30000); // 30 seconds
    });
  }

  driverAndLocationDetails(){
    const {vehicleType, contactNumber} = this.locationForm.value;

    //getGeolocationDrivers
    const payload = {
      pickupLocation: this.pickupLatLng,
      dropLocation: this.dropLatLng,
      vehicleType: vehicleType,
      contactNumber: contactNumber,
    };

    this.driverService.getGeolocationDriverDetails(payload).subscribe((response: ApiResultFormatModel) => {
      if (response.statusCode === 200) {
        this.activeVehicleLocations = response.data.map((vehicle: any) => {
          return {
            coordinates: vehicle.coordinates, // lat, lng
            vehicleType: vehicle.type, //vehicle type
            name: vehicle.name,               // Location name
            icon: vehicle.icon,               // Icon URL
            image: vehicle.image,
            vehicleNumber: vehicle.vehicleNumber, // Vehicle number
            color: vehicle.color,             // Vehicle color
            rate: vehicle.rate,               // Vehicle rate
            seats: vehicle.seats,             // Number of seats
            isFavorite: vehicle.favorite,   // Whether it's a favorite
            userCode: vehicle.userCode
          };
        });

        // Call the method to add markers on the map using updated vehicleLocations
        this.addVehicleMarkers();
      } else {

        Swal.fire({
          title: 'warning!',
          text: 'Error fetching vehicle locations.',
          icon: 'warning',
          confirmButtonText: 'OK'
        });
      }
    });

  }

  private addVehicleMarkers(): void {
    // active vehicle list show
    this.activeVehicleLocations.forEach(location => {
      new google.maps.Marker({
        position: location.coordinates,
        map: this.map,
        icon: {
          url: location.icon, // URL of the icon
          scaledSize: new google.maps.Size(60, 60), // Size of the icon in pixels
        },
        title: location.name
        // active vehicle click
      }).addListener('click', () => {
        // Handle marker click event
        // Set the clicked vehicle's details to the submittedCart object
        this.submittedCart = location;

      });
    });
  }


  geocodePickupLocationAndFocusMap(pickupLocation: string) {
    const geocoder = new google.maps.Geocoder();

    // Geocode the pickup location
    geocoder.geocode({address: pickupLocation}, (results, status) => {
      if (status === 'OK' && results[0]) {
        const pickupLatLng = results[0].geometry.location;

        // Add marker for the pickup location
        this.addMarker(pickupLatLng, 'Pickup Location');

        // Center the map on the pickup location and set a zoom level
        this.map.setCenter(pickupLatLng);
        this.map.setZoom(12);  // Adjust the zoom level as needed

        // Optional: Add a circle around the pickup location
        this.addRadiusCircle(pickupLatLng);


      } else {
        console.error(`Geocode failed for pickup location: ${status}`);
      }
    });
  }


  //radius set
  private addRadiusCircle(center: google.maps.LatLng): void {
    // Remove the existing circle if it exists
    if (this.userLocationCircle) {
      this.userLocationCircle.setMap(null);
    }

    this.userLocationCircle = new google.maps.Circle({
      center: center,
      radius: 2000, // 1 km radius
      fillColor: '#fec343',
      fillOpacity: 0.35,
      strokeColor: '#FF0000',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      map: this.map
    });
  }


  // Toggle like/unlike for the heart button
  toggleLike(): void {
    if (this.submittedCart) {
      this.submittedCart.liked = !this.submittedCart.liked;

      if (this.submittedCart.liked) {
        alert('Added to your favorite rider list');
      } else {
        alert('Removed from your favorite rider list');
      }
    }
  }


  // ============================


  geocodeLocations() {
    // Get input values from the form
    const {pickupLocation, dropLocation} = this.locationForm.value;

    // Create a Geocoder instance
    const geocoder = new google.maps.Geocoder();

    // Geocode pickup location
    geocoder.geocode({address: pickupLocation}, (results, status) => {
      if (status === 'OK' && results[0]) {
        const pickupLatLng = results[0].geometry.location;
        this.addMarker(pickupLatLng, 'Pickup Location');
        this.addRadiusCircle(pickupLatLng);  // Optional: Add a circle around the pickup location

        // After geocoding pickup location, geocode the drop location
        this.geocodeDropLocation(dropLocation, pickupLatLng);


      } else {
        console.error(`Geocode failed for pickup location: ${status}`);
      }
    });
  }

  geocodeDropLocation(dropLocation: string, pickupLatLng: google.maps.LatLng) {
    const geocoder = new google.maps.Geocoder();

    // Geocode drop location
    geocoder.geocode({address: dropLocation}, (results, status) => {
      if (status === 'OK' && results[0]) {
        const dropLatLng = results[0].geometry.location;
        this.addMarker(dropLatLng, 'Drop Location');

        //set the pickup and drop lat lang
        this.pickupLatLng = {lat: pickupLatLng.lat(), lng: pickupLatLng.lng()};
        this.dropLatLng = {lat: dropLatLng.lat(), lng: dropLatLng.lng()};

        // After both pickup and drop locations are geocoded, show the route between them
        this.displayRoute(pickupLatLng, dropLatLng);

        //calculate the price
        this.calculateDistanceAndPrice(pickupLatLng, dropLatLng);
      } else {
        console.error(`Geocode failed for drop location: ${status}`);
      }
    });
  }


  displayRoute(pickupLatLng: google.maps.LatLng, dropLatLng: google.maps.LatLng) {
    const request: google.maps.DirectionsRequest = {
      origin: pickupLatLng,
      destination: dropLatLng,
      travelMode: google.maps.TravelMode.DRIVING, // You can change to WALKING, BICYCLING, TRANSIT if needed
    };

    this.directionsService.route(request, (result, status) => {
      if (status === 'OK') {
        this.directionsRenderer.setDirections(result);
      } else {
        console.error('Directions request failed due to ' + status);
      }
    });
  }

  addMarker(location: google.maps.LatLng, title: string) {
    new google.maps.Marker({
      position: location,
      map: this.map,
      title: title,
    });
  }

  calculateDistanceAndPrice(pickupLatLng: google.maps.LatLng, dropLatLng: google.maps.LatLng) {
    const {vehicleType} = this.locationForm.value;
    const request: google.maps.DirectionsRequest = {
      origin: pickupLatLng,
      destination: dropLatLng,
      travelMode: google.maps.TravelMode.DRIVING, // Same travel mode as in the route display function
    };

    this.directionsService.route(request, (result, status) => {
      if (status === 'OK') {
        // Extract the distance from the route
        const route = result.routes[0];
        const leg = route.legs[0]; // Get the first leg of the route
        const distanceInMeters = leg.distance.value; // Distance in meters
        const distanceInKm = distanceInMeters / 1000; // Convert to kilometers

        if (vehicleType == "three_wheel") {
          this.pricePerKm = 100;
        } else if (vehicleType == "car") {
          this.pricePerKm = 150;
        } else if (vehicleType == "bike") {
          this.pricePerKm = 60;
        }

        // Calculate the total price based on the distance
        const totalPrice = (distanceInKm * this.pricePerKm).toFixed(2);
        const distanceKm = distanceInKm.toFixed(2);

        this.locationForm.get('totalPrice').setValue(totalPrice);
        this.locationForm.get('distanceKm').setValue(distanceKm)

      } else {
        console.error('Distance calculation failed due to ' + status);
      }
    });
  }


  public clearMap() {
    this.isLoader = false;
    this.activeVehicle = null;
    this.activeVehicleLocations = [];
    this.locationForm.reset();
    this.submittedCart = null;
    this.initializeGoogleMaps();

  }

  requestSend() {
    console.log()
  }
}
