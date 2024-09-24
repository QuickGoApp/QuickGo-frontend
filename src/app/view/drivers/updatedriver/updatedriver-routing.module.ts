import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {UpdatedriverComponent} from "./updatedriver.component";

const routes: Routes = [{ path: '', component: UpdatedriverComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UpdatedriverRoutingModule { }
