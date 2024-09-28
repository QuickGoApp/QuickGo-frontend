import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TripReportComponentRoutingModule } from './trip-report.component-routing.module';
import {ReactiveFormsModule} from "@angular/forms";
import {NgSelectModule} from "@ng-select/ng-select";
import {MatOptionModule} from "@angular/material/core";
import {MatSelectModule} from "@angular/material/select";
import {GoogleMapsModule} from "@angular/google-maps";
import {FeatherModule} from "angular-feather";
import {TripReportComponent} from "./trip-report.component";
import {CustomPaginationModule} from "../../../shared/custom-pagination/custom-pagination.module";
import {DatepickerModule} from "ng2-datepicker";
import {MatSortModule} from "@angular/material/sort";


@NgModule({
  declarations: [
    TripReportComponent
  ],
  imports: [

    ReactiveFormsModule,
    CommonModule,
    TripReportComponentRoutingModule,
    NgSelectModule,
    MatOptionModule,
    MatSelectModule,
    GoogleMapsModule,
    FeatherModule,
    CustomPaginationModule,
    DatepickerModule,
    MatSortModule,

  ]
})
export class TripReportComponentModule { }
