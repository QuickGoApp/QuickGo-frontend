import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SettingsService } from '../core/core.index';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent {
  public darkTheme = false;

  constructor(private router: Router, private settings: SettingsService) {
    this.settings.changeTheme.subscribe((res: string) => {
      if (res == 'Dark') this.darkTheme = true;
      else this.darkTheme = false;
    });
  }

 
}
