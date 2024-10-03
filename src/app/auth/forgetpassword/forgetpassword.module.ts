import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ForgetpasswordRoutingModule } from './forgetpassword-routing.module';
import { ForgetpasswordComponent } from './forgetpassword.component';
import {FormsModule} from "@angular/forms";


@NgModule({
  declarations: [
    ForgetpasswordComponent
  ],
  imports: [
    FormsModule,
    CommonModule,
    ForgetpasswordRoutingModule
  ]
})
export class ForgetpasswordModule { }
