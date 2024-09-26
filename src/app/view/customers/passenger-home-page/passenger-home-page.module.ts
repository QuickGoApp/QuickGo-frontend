import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PassengerHomePageRoutingModule } from './passenger-home-page-routing.module';
import {ReactiveFormsModule} from "@angular/forms";
import {NgSelectModule} from "@ng-select/ng-select";
import {MatOptionModule} from "@angular/material/core";
import {MatSelectModule} from "@angular/material/select";
import {PassengerHomePageComponent} from "./passenger-home-page.component";
import {GoogleMapsModule} from "@angular/google-maps";
import {FeatherModule} from "angular-feather";


@NgModule({
  declarations: [
    PassengerHomePageComponent
  ],
    imports: [

        ReactiveFormsModule,
        CommonModule,
        PassengerHomePageRoutingModule,
        NgSelectModule,
        MatOptionModule,
        MatSelectModule,
        GoogleMapsModule,
        FeatherModule,

    ]
})
export class PassengerHomePageModule { }
