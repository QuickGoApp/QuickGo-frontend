export class routes {
  private static base = '';

  public static get baseUrl(): string {
    return this.base;
  }
  // auth routes
  public static get auth(): string {
    return this.base + '/auth';
  }
  public static get signIn(): string {
    return this.base + '/signin';
  }
  public static get signUp(): string {
    return this.base + '/signup';
  }
  public static get forgotPassword(): string {
    return this.base + '/forgetpassword';
  }
  // auth routes *ends*

  // error pages routes

  public static get errorPages(): string {
    return this.baseUrl + '/errorpages';
  }
  public static get errorPage404(): string {
    return this.errorPages + '/error404';
  }
  public static get errorPage500(): string {
    return this.errorPages + '/error500';
  }

  public static get core(): string {
    return this.baseUrl;
  }

  public static get dashboard(): string {
    return this.core + '/dashboard';
  }


  public static get customer(): string {
    return this.core + '/customer';
  }
  public static get customerPassengerHome(): string {
    return this.customer + '/passenger-home-page';
  }

  public static get passengerHomePage(): string {
    return this.base + '/passenger-home-page';
  }
  public static get driverHomePage(): string {
    return this.base + '/driver-home-page';
  }


  public static get users(): string {
    return this.core + '/user';
  }

  public static get addUser(): string {
    return this.users + '/add-user';
  }
  public static get userPrivilege(): string {
    return this.users + '/user-privilege';
  }

  public static get updateProfile(): string {
    return this.users + '/update-profile';
  }
  public static get addVehicle(): string {
    return this.users + '/add-vehicle';
  }

  public static get report(): string {
    return this.core + '/report';
  }

  public static get ripReport(): string {
    return this.report + '/trip-report';
  }
  public static get driverReport(): string {
    return this.report + '/driver-report';
  }











}
