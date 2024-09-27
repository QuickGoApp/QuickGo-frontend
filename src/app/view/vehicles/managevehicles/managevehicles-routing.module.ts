import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ManagevehiclesComponent} from "./managevehicles.component";

const routes: Routes = [{ path: '', component: ManagevehiclesComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManagevehiclesRoutingModule { }
