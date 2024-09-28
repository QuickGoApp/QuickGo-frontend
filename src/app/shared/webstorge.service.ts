import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { routes } from '../core/routes-path/routes';
import {el} from "@fullcalendar/core/internal-common";


@Injectable({
  providedIn: 'root',
})
export class WebstorgeService {

  constructor(private router: Router) {}

  public login(data: any): void {
    sessionStorage.clear();
    sessionStorage.setItem('authenticated', 'true');
    sessionStorage.setItem('email', data.email);
    sessionStorage.setItem('role', data.roles[0]);
    sessionStorage.setItem('username', data.username);
    sessionStorage.setItem('token', data.token);
    sessionStorage.setItem('userId', data.userCode);
    sessionStorage.setItem('privilegeIds', data.privilegeIds);
    sessionStorage.setItem('vehicleType', data.vehicleType);

    // role wise manage main ui
    // this.router.navigate([routes.dashboard]);
    const role = (sessionStorage.getItem("role"))
    if(role == "ROLE_PASSENGER"){
      this.router.navigate([routes.passengerHomePage]);
    }else if(role =="ROLE_DRIVER"){
      this.router.navigate([routes.driverHomePage]);
    }else {
      this.router.navigate([routes.dashboard]);
    }
  }
  public submit(): void {
    sessionStorage.setItem('authenticated', 'true');
    this.router.navigate([routes.signIn]);
  }
  public Logout(): void {
    sessionStorage.removeItem('authorized');
    sessionStorage.removeItem('loginTime');
    this.router.navigate(['/auth/signin']);
  }
}
