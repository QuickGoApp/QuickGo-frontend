import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdduserRoutingModule } from './adduser-routing.module';
import { AdduserComponent } from './adduser.component';
import { sharedModule } from 'src/app/shared/shared.module';
import {ReactiveFormsModule} from "@angular/forms";


@NgModule({
  declarations: [
    AdduserComponent
  ],
    imports: [
        CommonModule,
        AdduserRoutingModule,
        sharedModule,
        ReactiveFormsModule
    ]
})
export class AdduserModule { }
