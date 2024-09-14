import {Component, OnInit} from '@angular/core';
import {routes} from "../../../core/routes-path/routes";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Loader} from '@googlemaps/js-api-loader';
import {DriverService} from "../../../../api-service/service/DriverService";
import Swal from "sweetalert2";  // Make sure this is from '@googlemaps/js-api-loader'

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {

  protected readonly routes = routes;
  locationForm: FormGroup;
  activeVehicle: string | null = null; // Track selected vehicle
  submittedCart: any = null; // Store the submitted cart details

  public vehicleTypes = [];
  private vehicleLocations = [];

  private map!: google.maps.Map;
  private directionsService!: google.maps.DirectionsService;
  private directionsRenderer!: google.maps.DirectionsRenderer;
  private geocoder!: google.maps.Geocoder;
  private userLocationCircle!: google.maps.Circle; // To store the circle object

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor(private driverService:DriverService) {
    this.locationForm = new FormGroup({
      pickupLocation: new FormControl('', [Validators.required]),
      dropLocation: new FormControl('', [Validators.required]),
      vehicleType: new FormControl('', [Validators.required]),
      contactNumber: new FormControl('', [
        Validators.required,
        Validators.pattern('^\\+?\\d{10,15}$') // Example regex to validate phone numbers
      ])
    });

    this.loadSelectVehicleType();
  }

  ngOnInit(): void {
    this.initializeGoogleMaps();
  }

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

          // Call the method to add markers on the map using updated vehicleLocations
          this.addVehicleMarkers();
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




  private initializeGoogleMaps(): void {
    const loader = new Loader({
      apiKey: 'AIzaSyCaKbVhcX_22R_pRKDYuNA7vox-PtGaDkI',
      version: 'weekly',
      libraries: ['places']
    });

    loader.load().then(() => {
      this.map = new google.maps.Map(document.getElementById('map') as HTMLElement, {
        center: { lat: 7.8731, lng: 80.7718 },
        zoom: 11
      });

      this.directionsService = new google.maps.DirectionsService();
      this.directionsRenderer = new google.maps.DirectionsRenderer();
      this.directionsRenderer.setMap(this.map);

      this.geocoder = new google.maps.Geocoder();

      // set the current locaion
      this.setCurrentLocation();


    }).catch(error => {
      console.error('Error loading Google Maps:', error);
    });
  }

  private setCurrentLocation(): void {
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
    this.geocoder.geocode({ location: latLng }, (results, status) => {
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
    if (this.locationForm.valid) {
      const { pickupLocation, dropLocation, vehicleType, contactNumber} = this.locationForm.value;

      // Simulate cart data for rider details
      this.submittedCart = {
        riderImage: 'https://www.riyasakwala.lk/public/images/vehicle_type/ad_default/three-wheelers.jpg',  // Replace with actual rider image
        vehicleNumber: 'ABC-1234',
        vehicleColor: 'Yellow',
        vehicleType,
        liked: false  // Initially not liked
      };

      console.log('Pickup Location:', pickupLocation);
      console.log('Drop Location:', dropLocation);
      console.log('Selected Vehicle:', vehicleType);
      console.log('Selected contact:', contactNumber);

      // Fetch the user's current location again
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const userLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

            this.searchTheActiveVehicle();
            // Add a 2km radius circle around the user's location
            this.addRadiusCircle(userLocation);

            // Calculate and display the route
            //this.calculateAndDisplayRoute(pickupLocation, dropLocation);

            // =======================================
            this.geocodeLocations();
          },
          () => {
            console.warn('Geolocation failed or was denied by the user. Showing default location.');
          }
        );
      } else {
        console.warn('Geolocation is not supported by this browser. Showing default location.');
      }
    } else {
      console.log('Form is invalid');
    }
  }

  //radius set
  private addRadiusCircle(center: google.maps.LatLng): void {
    // Remove the existing circle if it exists
    if (this.userLocationCircle) {
      this.userLocationCircle.setMap(null);
    }

    this.userLocationCircle = new google.maps.Circle({
      center: center,
      radius: 2000, // 2 km radius
      fillColor: '#fec343',
      fillOpacity: 0.35,
      strokeColor: '#FF0000',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      map: this.map
    });
  }


  private searchTheActiveVehicle() {
    this.driverService.getActiveVehicle().subscribe(
      (data) => {
        if (data.statusCode === 200) {
          // Assuming the API returns the 'coordinates', 'name', and 'icon' fields directly
          this.vehicleLocations = data.data.map((vehicle: any) => {
            return {
              coordinates: vehicle.coordinates,
              name: vehicle.name,
              icon: vehicle.icon
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

  private addVehicleMarkers(): void {
    this.vehicleLocations.forEach(location => {
      new google.maps.Marker({
        position: location.coordinates,
        map: this.map,
        icon: {
          url: location.icon, // URL of the icon
          scaledSize: new google.maps.Size(40, 40), // Size of the icon in pixels
        },
        title: location.name
      }).addListener('click', () => {
        // Handle marker click event
        //this.calculateAndDisplayRoute(this.locationForm.get('pickupLocation')?.value, location.coordinates);
      });
    });
  }


  // calculateAndDisplayRoute(pickupLocation: string, destinationCoordinates: google.maps.LatLngLiteral): void {
  //   this.directionsService.route(
  //     {
  //       origin: pickupLocation,
  //       destination: destinationCoordinates,
  //       travelMode: google.maps.TravelMode.DRIVING
  //     },
  //     (response, status) => {
  //       if (status === 'OK') {
  //         this.directionsRenderer.setDirections(response);
  //       } else {
  //         console.error('Directions request failed due to ' + status);
  //       }
  //     }
  //   );
  // }



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
    const { pickupLocation, dropLocation } = this.locationForm.value;

    // Create a Geocoder instance
    const geocoder = new google.maps.Geocoder();

    // Geocode pickup location
    geocoder.geocode({ address: pickupLocation }, (results, status) => {
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
    geocoder.geocode({ address: dropLocation }, (results, status) => {
      if (status === 'OK' && results[0]) {
        const dropLatLng = results[0].geometry.location;
        this.addMarker(dropLatLng, 'Drop Location');

        // After both pickup and drop locations are geocoded, show the route between them
        this.displayRoute(pickupLatLng, dropLatLng);
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



}
