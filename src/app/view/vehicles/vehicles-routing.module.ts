import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {VehiclesComponent} from "./vehicles.component";

const routes: Routes = [
  { path: '', redirectTo: 'vehicle', pathMatch: 'full' },
  {
    path: '',
    component: VehiclesComponent,
    children: [
      {
        path: 'add-vehicle',
        loadChildren: () =>
          import('./managevehicles/managevehicles.module').then((m) => m.ManagevehiclesModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VehiclesRoutingModule {}
