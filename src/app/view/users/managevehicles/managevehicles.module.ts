import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { sharedModule } from 'src/app/shared/shared.module';
import {ReactiveFormsModule} from "@angular/forms";
import {ManagevehiclesRoutingModule} from "./managevehicles-routing.module";
import {ManagevehiclesComponent} from "./managevehicles.component";



@NgModule({
  declarations: [
    ManagevehiclesComponent
  ],
  imports: [
    CommonModule,
    ManagevehiclesRoutingModule,
    sharedModule,
    ReactiveFormsModule
  ]
})
export class ManagevehiclesModule { }
