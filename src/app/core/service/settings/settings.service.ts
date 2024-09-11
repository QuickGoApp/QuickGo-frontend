import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { routes } from '../../core.index';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  public routes = routes;
  public changeTheme: BehaviorSubject<string> = new BehaviorSubject<string>(
    sessionStorage.getItem('theme') || 'light'
  );
  public changeLayout: BehaviorSubject<string> = new BehaviorSubject<string>(
    sessionStorage.getItem('changeLayout') || '1'
  );

  public setLayout(value: string) {
    this.changeLayout.next(value);
    sessionStorage.setItem('changeLayout', value);
    // this.router.navigate([routes.dashboard]);
  }

  constructor(private router: Router) {}
}
