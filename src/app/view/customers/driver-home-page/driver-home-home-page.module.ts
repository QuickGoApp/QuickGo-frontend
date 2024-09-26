import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DriverHomeHomePageRoutingModule } from './driver-home-home-page-routing.module';
import {ReactiveFormsModule} from "@angular/forms";
import {NgSelectModule} from "@ng-select/ng-select";
import {MatOptionModule} from "@angular/material/core";
import {MatSelectModule} from "@angular/material/select";
import {GoogleMapsModule} from "@angular/google-maps";
import {FeatherModule} from "angular-feather";
import {DriverHomePageComponent} from "./driver-home-page.component";


@NgModule({
  declarations: [
    DriverHomePageComponent
  ],
    imports: [

        ReactiveFormsModule,
        CommonModule,
        DriverHomeHomePageRoutingModule,
        NgSelectModule,
        MatOptionModule,
        MatSelectModule,
        GoogleMapsModule,
        FeatherModule,

    ]
})
export class DriverHomeHomePageModule { }
