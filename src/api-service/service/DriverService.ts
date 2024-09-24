import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../environments/environment.prod";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class DriverService {
  BASEURL = '';
  constructor(private http: HttpClient) {
    this.BASEURL = environment.baseURL;
  }

  getDrivers(): Observable<any[]> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('token'));
    return this.http.get<any[]>(this.BASEURL + 'auth/driver/drivers', { headers });
  }

  updateUser(existUserId: number, userData: any) {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('token'));
    console.log('Sending PUT request to:', `${this.BASEURL}+'auth/drivers/'+${existUserId}`);
    console.log('Payload:', userData);
    return this.http.put<any>(this.BASEURL+'auth/driver/updateDriver/'+existUserId, userData, { headers });

  }

  deleteUser(userId: number) {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('token'));
    return this.http.delete(this.BASEURL+'auth/driver/deleteDriver/'+userId, { headers });
  }

}
