import {Component, OnInit} from '@angular/core';
import {routes} from "../../../core/routes-path/routes";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Loader} from '@googlemaps/js-api-loader';  // Make sure this is from '@googlemaps/js-api-loader'

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


  vehicleTypes = [
    {
      type: 'three_wheel',
      name: 'Three-Wheel',
      imageUrl: 'https://www.riyasakwala.lk/public/images/vehicle_type/ad_default/three-wheelers.jpg'
    },
    {
      type: 'car',
      name: 'Car',
      imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSdQvaj4xjLm09WZ2ynHKU--bLrBE4gQ3dlUQ&s'
    },
    {
      type: 'van',
      name: 'Van',
      imageUrl: 'https://static.vecteezy.com/system/resources/thumbnails/008/602/412/small/mpv-van-car-monochrome-isolated-vector.jpg'
    },
    {
      type: 'bike',
      name: 'Bike',
      imageUrl: 'https://static.vecteezy.com/system/resources/previews/045/892/561/non_2x/motorbike-icon-symbols-illustration-vector.jpg'
    }
  ];


  vehicleLocations = [
    {
      coordinates: { lat: 6.873683, lng: 79.958035 },
      name: 'Location 1',
      icon: 'https://png.pngtree.com/png-vector/20230206/ourmid/pngtree-yellow-car-side-view-vector-illustration-in-trendy-flat-style-isolated-png-image_6585619.png' // Update with actual icon URL
    },
    {
      coordinates: { lat: 6.911522, lng: 79.867240 },
      name: 'Location 2',
      icon: 'https://png.pngtree.com/png-vector/20230206/ourmid/pngtree-yellow-car-side-view-vector-illustration-in-trendy-flat-style-isolated-png-image_6585619.png' // Update with actual icon URL
    },
    {
      coordinates: { lat: 6.845000, lng: 79.935457 },
      name: 'Location 3',
      icon: 'https://png.pngtree.com/png-vector/20230206/ourmid/pngtree-yellow-car-side-view-vector-illustration-in-trendy-flat-style-isolated-png-image_6585619.png' // Update with actual icon URL
    }
  ];


  private map!: google.maps.Map;
  private directionsService!: google.maps.DirectionsService;
  private directionsRenderer!: google.maps.DirectionsRenderer;
  private geocoder!: google.maps.Geocoder;
  private userLocationCircle!: google.maps.Circle; // To store the circle object

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {
    this.locationForm = new FormGroup({
      pickupLocation: new FormControl('', [Validators.required]),
      dropLocation: new FormControl('', [Validators.required]),
      vehicleType: new FormControl('', [Validators.required])
    });
  }

  ngOnInit(): void {
    this.initializeGoogleMaps();
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
        zoom: 12
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

  onSubmit(): void {
    if (this.locationForm.valid) {
      const { pickupLocation, dropLocation, vehicleType } = this.locationForm.value;

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

      // Fetch the user's location again
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const userLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

            // Add a 2km radius circle around the user's location
            this.addRadiusCircle(userLocation);

            // Calculate and display the route
            this.calculateAndDisplayRoute(pickupLocation, dropLocation);
            // Add markers for vehicle locations
            this.addVehicleMarkers();
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

  calculateAndDisplayRoute(pickupLocation: string, destinationCoordinates: google.maps.LatLngLiteral): void {
    this.directionsService.route(
      {
        origin: pickupLocation,
        destination: destinationCoordinates,
        travelMode: google.maps.TravelMode.DRIVING
      },
      (response, status) => {
        if (status === 'OK') {
          this.directionsRenderer.setDirections(response);
        } else {
          console.error('Directions request failed due to ' + status);
        }
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
        this.calculateAndDisplayRoute(this.locationForm.get('pickupLocation')?.value, location.coordinates);
      });
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


}
