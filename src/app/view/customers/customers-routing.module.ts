import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {CustomersComponent} from "./customers.component";

const routes: Routes = [
  { path: '', redirectTo: 'home-page', pathMatch: 'full' },
  {
    path: '',
    component: CustomersComponent,
    children: [
      {
        path: 'passenger-home-page',
        loadChildren: () =>
          import('./passenger-home-page/passenger-home-page.module').then((m) => m.PassengerHomePageModule),
      },
      {
        path: 'driver-home-page',
        loadChildren: () =>
          import('./driver-home-page/driver-home-home-page.module').then((m) => m.DriverHomeHomePageModule),
      }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomersRoutingModule { }
