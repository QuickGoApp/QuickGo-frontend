import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {TripReportComponent} from "./trip-report.component";

const routes: Routes = [{ path: '', component: TripReportComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TripReportComponentRoutingModule { }
