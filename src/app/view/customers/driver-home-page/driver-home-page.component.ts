import {Component, OnInit} from '@angular/core';
import {routes} from "../../../core/routes-path/routes";
import {Loader} from "@googlemaps/js-api-loader";

@Component({
  selector: 'app-driver-home-page',
  templateUrl: './driver-home-page.component.html',
  styleUrls: ['./driver-home-page.component.scss']
})
export class DriverHomePageComponent implements OnInit{

  protected readonly routes = routes;

  private map!: google.maps.Map;
  private directionsService!: google.maps.DirectionsService;
  private directionsRenderer!: google.maps.DirectionsRenderer;
  private geocoder!: google.maps.Geocoder;


  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {
  }

  ngOnInit(): void {
    this.initializeGoogleMaps();
  }

  private initializeGoogleMaps() {
    const loader = new Loader({
      apiKey: 'AIzaSyCaKbVhcX_22R_pRKDYuNA7vox-PtGaDkI',
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
}
