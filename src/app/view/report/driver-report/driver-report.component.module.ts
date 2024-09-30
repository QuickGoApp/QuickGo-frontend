import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DriverReportComponentRoutingModule } from './driver-report.component-routing.module';
import {ReactiveFormsModule} from "@angular/forms";
import {NgSelectModule} from "@ng-select/ng-select";
import {MatOptionModule} from "@angular/material/core";
import {MatSelectModule} from "@angular/material/select";
import {GoogleMapsModule} from "@angular/google-maps";
import {FeatherModule} from "angular-feather";
import {CustomPaginationModule} from "../../../shared/custom-pagination/custom-pagination.module";
import {DatepickerModule} from "ng2-datepicker";
import {MatSortModule} from "@angular/material/sort";
import {DriverReportComponent} from "./driver-report.component";


@NgModule({
  declarations: [
    DriverReportComponent
  ],
  imports: [

    ReactiveFormsModule,
    CommonModule,
    DriverReportComponentRoutingModule,
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
export class DriverReportComponentModule { }
