import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../environments/environment.prod";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class VehicleService {
  BASEURL = '';
  constructor(private http: HttpClient) {
    this.BASEURL = environment.baseURL;
  }

  addVehicle(payLoad: any) {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('token'));
    return this.http.post<any>(environment.baseURL + 'vehicle/vehicle', payLoad,{headers});
  }

  getVehicles(): Observable<any[]> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('token'));
    return this.http.get<any[]>(this.BASEURL + 'vehicle/vehicles', { headers });
  }

  updateVehicle(existVehicleId: number, vehicleData: any) {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('token'));
    console.log('Sending PUT request to:', `${this.BASEURL}+'vehicle/'+${existVehicleId}`);
    console.log('Payload:', vehicleData);
    return this.http.put<any>(this.BASEURL+'vehicle/updateVehicle/'+existVehicleId, vehicleData, { headers });

  }

  deleteVehicle(vehicleId: number) {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('token'));
    return this.http.delete(this.BASEURL+'auth/vehicle/deleteVehicle/'+vehicleId, { headers });
  }



}
