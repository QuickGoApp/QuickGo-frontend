import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {DriversComponent} from "./drivers.component";

const routes: Routes = [
  { path: '', redirectTo: 'driver', pathMatch: 'full' },
  {
    path: '',
    component: DriversComponent,
    children: [
      {
        path: 'add-driver',
        loadChildren: () =>
          import('./adddriver/adddriver.module').then((m) => m.AdddriverModule),
      },
      {
        path: 'update-profile',
        loadChildren: () =>
          import('./updateprofile/updateprofile.module').then((m) => m.UpdateprofileModule),
      }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DriversRoutingModule {}
