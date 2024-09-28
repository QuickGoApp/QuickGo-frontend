import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {HeaderComponent} from "../common-component/header/header.component";
import {SidebarOneComponent} from "../common-component/sidebar-one/sidebar-one.component";
import {SidebarTwoComponent} from "../common-component/sidebar-two/sidebar-two.component";
import {SidebarThreeComponent} from "../common-component/sidebar-three/sidebar-three.component";
import {SidebarFourComponent} from "../common-component/sidebar-four/sidebar-four.component";
import {SidebarFiveComponent} from "../common-component/sidebar-five/sidebar-five.component";
import {LayoutComponent} from "../common-component/layout/layout.component";
import {sharedModule} from "../shared/shared.module";
import {ViewComponent} from "./view.component";
import {ViewRoutingModule} from "./view-routing.module";


@NgModule({
  declarations: [
    ViewComponent,
    HeaderComponent,
    SidebarOneComponent,
    SidebarTwoComponent,
    SidebarThreeComponent,
    SidebarFourComponent,
    SidebarFiveComponent,
    LayoutComponent,


  ],
  imports: [CommonModule, ViewRoutingModule, sharedModule ],
  providers: [],
})
export class ViewModule { }
