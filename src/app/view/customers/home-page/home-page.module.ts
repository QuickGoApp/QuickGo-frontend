import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomePageRoutingModule } from './home-page-routing.module';
import {ReactiveFormsModule} from "@angular/forms";
import {NgSelectModule} from "@ng-select/ng-select";
import {MatOptionModule} from "@angular/material/core";
import {MatSelectModule} from "@angular/material/select";
import {HomePageComponent} from "./home-page.component";
import {GoogleMapsModule} from "@angular/google-maps";


@NgModule({
  declarations: [
    HomePageComponent
  ],
  imports: [

    ReactiveFormsModule,
    CommonModule,
    HomePageRoutingModule,
    NgSelectModule,
    MatOptionModule,
    MatSelectModule,
    GoogleMapsModule,

  ]
})
export class HomePageModule { }
