import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReportComponent } from './report.component';

const routes: Routes = [
  { path: '', redirectTo: 'report', pathMatch: 'full' },
  {
    path: '',
    component: ReportComponent,
    children: [
      {
        path: 'trip-report',
        loadChildren: () =>
          import('./trip-report/trip-report.component.module').then(
            (m) => m.TripReportComponentModule
          ),
      },
      {
        path: 'driver-report',
        loadChildren: () =>
          import('./driver-report/driver-report.component.module').then(
            (m) => m.DriverReportComponentModule
          ),
      },

    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportRoutingModule {}
