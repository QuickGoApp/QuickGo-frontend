import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { sharedModule } from 'src/app/shared/shared.module';
import {ReactiveFormsModule} from "@angular/forms";
import {UpdatedriverComponent} from "./updatedriver.component";
import {UpdatedriverRoutingModule} from "./updatedriver-routing.module";


@NgModule({
  declarations: [
    UpdatedriverComponent
  ],
  imports: [
    CommonModule,
    UpdatedriverRoutingModule,
    sharedModule,
    ReactiveFormsModule
  ]
})
export class UpdatedriverModule { }
