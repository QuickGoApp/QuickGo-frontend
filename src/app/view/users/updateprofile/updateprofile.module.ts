import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { sharedModule } from 'src/app/shared/shared.module';
import {ReactiveFormsModule} from "@angular/forms";
import {UpdateprofileComponent} from "./updateprofile.component";
import {UpdateprofileRoutingModule} from "./updateprofile-routing.module";


@NgModule({
  declarations: [
    UpdateprofileComponent
  ],
  imports: [
    CommonModule,
    UpdateprofileRoutingModule,
    sharedModule,
    ReactiveFormsModule
  ]
})
export class UpdateprofileModule { }
