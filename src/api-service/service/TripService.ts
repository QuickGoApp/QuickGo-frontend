import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../environments/environment.prod";
import {Observable} from "rxjs";
import {ApiResultFormatModel} from "../model/common/ApiResultFormatModel";

@Injectable({
  providedIn: 'root',
})
export class TripService {
  BASEURL = '';
  constructor(private http: HttpClient) {
    this.BASEURL = environment.baseURL;
  }

  public saveFavoriteDriver(payload: any): Observable<ApiResultFormatModel> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('token'));
    return this.http.post<ApiResultFormatModel>(this.BASEURL + 'trip/saveFavoriteDriver', payload, { headers });
  }

  public saveTripRequest(payload: any): Observable<ApiResultFormatModel> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('token'));
    return this.http.post<ApiResultFormatModel>(this.BASEURL + 'trip/saveTripRequest', payload, { headers });
  }
  public getDriverTrip(payload: any): Observable<ApiResultFormatModel> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('token'));
    return this.http.post<ApiResultFormatModel>(this.BASEURL + 'trip/getDriverTrip', payload, { headers });
  }

  public passengerCancelTripRequest(payload: any): Observable<ApiResultFormatModel> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('token'));
    return this.http.post<ApiResultFormatModel>(this.BASEURL + 'trip/cancelTripRequest', payload, { headers });
  }

  public driverCancelTripRequest(payload: any): Observable<ApiResultFormatModel> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('token'));
    return this.http.post<ApiResultFormatModel>(this.BASEURL + 'trip/driverCancelTripRequest', payload, { headers });
  }

  public acceptTripRequest(payload: any): Observable<ApiResultFormatModel> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('token'));
    return this.http.post<ApiResultFormatModel>(this.BASEURL + 'trip/acceptTripRequest', payload, { headers });
  }

  public endTripRequest(payload: any): Observable<ApiResultFormatModel> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('token'));
    return this.http.post<ApiResultFormatModel>(this.BASEURL + 'trip/endTripRequest', payload, { headers });
  }

  public getTripReport(payload: any): Observable<ApiResultFormatModel> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('token'));
    return this.http.post<ApiResultFormatModel>(this.BASEURL + 'report/admin/trip', payload, { headers });
  }

  public getDriverReport(payload: any): Observable<ApiResultFormatModel> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('token'));
    return this.http.post<ApiResultFormatModel>(this.BASEURL + 'report/admin/driver', payload, { headers });
  }

}
