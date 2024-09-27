import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AdddriverComponent} from "./adddriver.component";

const routes: Routes = [{ path: '', component: AdddriverComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdddriverRoutingModule { }
