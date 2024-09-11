import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserlistsRoutingModule } from './userlists-routing.module';
import { UserlistsComponent } from './userlists.component';
import { sharedModule } from 'src/app/shared/shared.module';
@NgModule({
  declarations: [UserlistsComponent],
  imports: [
    CommonModule,
    UserlistsRoutingModule,
    sharedModule,
  ],
  bootstrap: [UserlistsComponent],
})
export class UserlistsModule {}
