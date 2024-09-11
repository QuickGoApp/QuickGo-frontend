import { Component } from '@angular/core';
import {SettingsService} from "../core/service/settings/settings.service";
import {WebstorgeService} from "../shared/webstorge.service";
import {SidebarService} from "../core/service/sidebar/sidebar.service";
import {
  NavigationEnd,
  NavigationStart,
  Router,
  Event as RouterEvent,
} from '@angular/router';
import {url} from "../shared/model/sidebar.model";

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class ViewComponent {
  activePath = '';
  public sideBaractivePath = false;
  public darkTheme = false;
  public changeLayout = '1';
  public miniSidebar = false;
  public expandMenu = false;
  public mobileSidebar = false;
  base = '';
  page = '';

  constructor(
    private Router: Router,
    private settings: SettingsService,
    private auth: WebstorgeService,
    private sidebar: SidebarService
  ) {
    this.activePath = this.Router.url.split('/')[2];
    this.getRoutes(this.Router);
    this.settings.changeTheme.subscribe((res: string) => {
      if (res == 'Dark') this.darkTheme = true;
      else this.darkTheme = false;
    });
    this.settings.changeLayout.subscribe((res: string) => {
      this.changeLayout = res;
    });

    // <* condition to check mobile side bar position *>
    this.sidebar.toggleMobileSideBar.subscribe((res: string) => {
      if (res == 'true' || res == 'true') {
        this.mobileSidebar = true;
      } else {
        this.mobileSidebar = false;
      }
    });

    this.sidebar.expandSideBar.subscribe((res: boolean) => {
      this.expandMenu = res;
    });
    this.Router.events.subscribe((data: RouterEvent) => {
      if (data instanceof NavigationStart) {
        this.activePath = data.url.split('/')[2];
        this.getRoutes(data);
      }
      if (data instanceof NavigationEnd) {
        sessionStorage.removeItem('isMobileSidebar');
        this.mobileSidebar = false;
      }

    });
    this.sidebar.sideBarPosition.subscribe((res: string) => {
      if (res == 'true' && this.page !== 'pos') {
        this.miniSidebar = true;
      } else {
        this.miniSidebar = false;
      }
    });

    this.getRoutes(this.Router);
  }

  private getRoutes(data: url): void {
    const splitVal = data.url.split('/');
    this.base = splitVal[1];
    this.page = splitVal[2];
    if (
      data.url.split('/')[1] === 'errorpages' ||
      data.url.split('/')[2] === 'pos' ||
      data.url.split('/')[1] === 'auth'
    ) {
      this.sideBaractivePath = true;
    } else {
      this.sideBaractivePath = false;
    }
    if (data.url.split('/')[2] === 'pos') {
      this.sideBaractivePath = true;
    }
    if (this.base !== 'dashboard') {
      this.settings.setLayout('1');
      // this.miniSidebar = false;
    }

    // console.log(window.innerWidth);
    if (window.innerWidth > 990 && sessionStorage.getItem('isMobileSidebar')) {
      sessionStorage.removeItem('isMobileSidebar');
    }
    this.sessionOut();
  }

  private sessionOut(): void {
    const loginTime: string = sessionStorage.getItem('loginTime') || Date();
    // convert to date object and get minutes
    const timeOutMin: number = new Date(loginTime).getMinutes();
    const currentMin: number = new Date().getMinutes();
    const minDiff = timeOutMin - currentMin;
    // session will be closed in 15min from login time
    if (sessionStorage.getItem('loginTime') && minDiff > 15) {
      this.auth.Logout();
    }
  }

}
