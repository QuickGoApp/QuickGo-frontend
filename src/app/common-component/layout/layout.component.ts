import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {
  SettingsService,
  SidebarService,
  routes,
} from 'src/app/core/core.index';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent {
  public routes = routes;
  showPreview = false;
  showNavigation = false;
  public darkTheme = false;
  public changeLayout = '1';

  constructor(
    public Settings: SettingsService,
    private router: Router,
    private sidebar: SidebarService
  ) {
    this.Settings.changeTheme.subscribe((res: string) => {
      if (res == 'Dark') this.darkTheme = true;
      else this.darkTheme = false;
    });
    this.Settings.changeLayout.subscribe((res: string) => {
      this.changeLayout = res;
    });
  }

  public changeTheme(theme: string): void {
    this.Settings.changeTheme.next(theme);
    sessionStorage.setItem('theme', theme);
  }
  public setRtlFormat(): void {
    window.location.href =
      'https://www.linkedin.com/in/asitha-dananjaya-86156a176/?originalSubdomain=lk' +
      this.router.url;
  }
  public setLtrFormat(): void {
    window.location.href =
      'https://www.linkedin.com/in/asitha-dananjaya-86156a176/?originalSubdomain=lk' + this.router.url;
  }
  direction(value: string) {
    this.Settings.setLayout(value);
    this.router.navigate([routes.dashboard]);
    this.sidebar.sideBarPosition.next('false');
    sessionStorage.removeItem('sideBarPosition')
    // setTimeout(() => {
    //   this.router.navigate([routes.dashboard]);
    // }, 2000);
  }
}
