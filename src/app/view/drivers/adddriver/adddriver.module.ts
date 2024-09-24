import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { sharedModule } from 'src/app/shared/shared.module';
import {ReactiveFormsModule} from "@angular/forms";
import {AdddriverRoutingModule} from "./adddriver-routing.module";
import {AdddriverComponent} from "./adddriver.component";


@NgModule({
  declarations: [
    AdddriverComponent
  ],
  imports: [
    CommonModule,
    AdddriverRoutingModule,
    sharedModule,
    ReactiveFormsModule
  ]
})
export class AdddriverModule { }
