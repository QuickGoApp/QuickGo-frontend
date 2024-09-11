import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {CustomersComponent} from "./customers.component";
import {CustomersRoutingModule} from "./customers-routing.module";
import {DatepickerModule} from "ng2-datepicker";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatOptionModule} from "@angular/material/core";
import {MatSelectModule} from "@angular/material/select";




@NgModule({
  declarations: [CustomersComponent],
  imports: [
    CommonModule,
    DatepickerModule,
    FormsModule,
    ReactiveFormsModule,
    MatOptionModule,
    MatSelectModule,
    CustomersRoutingModule,
  ]
})
export class CustomersModule { }
