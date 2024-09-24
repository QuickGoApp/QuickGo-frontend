import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {VehiclesComponent} from "./vehicles.component";
import { MatDialogModule } from '@angular/material/dialog';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatOptionModule} from "@angular/material/core";
import {MatSelectModule} from "@angular/material/select";
import {VehiclesRoutingModule} from "./vehicles-routing.module";


@NgModule({
  declarations: [
    VehiclesComponent,
    // UpdatedriverComponent,
  ],
  imports: [
    CommonModule,
    VehiclesRoutingModule,
    MatDialogModule,
    FormsModule,
    MatOptionModule,
    MatSelectModule,
    ReactiveFormsModule,
  ]
})
export class VehiclesModule { }
