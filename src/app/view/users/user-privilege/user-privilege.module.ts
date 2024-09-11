import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {sharedModule} from "../../../shared/shared.module";
import {ReactiveFormsModule} from "@angular/forms";
import {UserPrivilegeComponent} from "./user-privilege.component";
import {UserPrivilegeRoutingModule} from "./user-privilege-routing.module";

@NgModule({
  declarations: [
    UserPrivilegeComponent
  ],
  imports: [
    CommonModule,
    UserPrivilegeRoutingModule,
    sharedModule,
    ReactiveFormsModule
  ]
})
export class UserPrivilegeModule {}
