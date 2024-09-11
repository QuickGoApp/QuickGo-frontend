import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {UserPrivilegeComponent} from "./user-privilege.component";

const routes: Routes = [{ path: '', component: UserPrivilegeComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserPrivilegeRoutingModule{}
