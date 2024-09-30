import { Component, OnInit } from '@angular/core';
import { NavigationStart, Router, Event as RouterEvent } from '@angular/router';
import { SettingsService, SidebarService } from 'src/app/core/core.index';
import { WebstorgeService } from 'src/app/shared/webstorge.service';
import { routes } from 'src/app/core/routes-path/routes';
import * as Feather from 'feather-icons';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit{
  public routes = routes;
  activePath = '';
  showSearch = false;
  public changeLayout = '1';
  public darkTheme = false;
  public logoPath = '';
  public miniSidebar = false;
  elem=document.documentElement
  public addClass = false;
  public userName = sessionStorage.getItem("username");
  public userRole = sessionStorage.getItem("role");


  constructor(
    private Router: Router,
    private settings: SettingsService,
    private sidebar: SidebarService,
    private webStorage: WebstorgeService

  ) {
    this.activePath = this.Router.url.split('/')[2];
    this.Router.events.subscribe((data: RouterEvent) => {
      if (data instanceof NavigationStart) {
        this.activePath = data.url.split('/')[2];
      }
    });
    this.settings.changeLayout.subscribe((res: string) => {
      this.changeLayout = res;
    });
    this.sidebar.sideBarPosition.subscribe((res: string) => {
      if (res == 'true') {
        this.miniSidebar = true;
      } else {
        this.miniSidebar = false;
      }
    });
    this.settings.changeTheme.subscribe((res: string) => {
      if (res == 'Dark') {
        this.darkTheme = true;
        this.logoPath = 'assets/img/logo.png';
      } else {
        this.darkTheme = false;
        this.logoPath = 'assets/img/logo.png';
      }
    });
  }

  ngOnInit(): void {
    Feather.replace();
  }

  public logout(): void {
    this.webStorage.Logout();
  }

  public toggleSidebar(): void {
    this.sidebar.switchSideMenuPosition();
  }

  public togglesMobileSideBar(): void {
    this.sidebar.switchMobileSideBarPosition();
  }

  public miniSideBarMouseHover(position: string): void {
    if (position == 'over') {
      this.sidebar.expandSideBar.next(true);
    } else {
      this.sidebar.expandSideBar.next(false);
    }
  }

  fullscreen() {
    if(!document.fullscreenElement) {
      this.elem.requestFullscreen();
    }
    else {
      document.exitFullscreen();
    }
  }
}
