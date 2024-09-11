import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReportComponent } from './report.component';

const routes: Routes = [
  { path: '', redirectTo: 'purchaseorderreport', pathMatch: 'full' },
  {
    path: '',
    component: ReportComponent,
    children: [
      // {
      //   path: 'purchase-order-report',
      //   loadChildren: () =>
      //     import('./purchaseorderreport/purchaseorderreport.module').then(
      //       (m) => m.PurchaseorderreportModule
      //     ),
      // },

    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportRoutingModule {}
