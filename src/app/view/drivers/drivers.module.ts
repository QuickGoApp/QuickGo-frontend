import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {DriversRoutingModule} from './drivers-routing.module';
import {DriversComponent} from "./drivers.component";
import { MatDialogModule } from '@angular/material/dialog';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatOptionModule} from "@angular/material/core";
import {MatSelectModule} from "@angular/material/select";

@NgModule({
  declarations: [
    DriversComponent,
    //UpdateprofileComponent,
    // UpdatedriverComponent,
  ],
  imports: [
    CommonModule,
    DriversRoutingModule,
    MatDialogModule,
    FormsModule,
    MatOptionModule,
    MatSelectModule,
    ReactiveFormsModule
  ]
})
export class DriversModule { }
