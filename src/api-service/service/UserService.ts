import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../environments/environment.prod";
import {Observable} from "rxjs";
import {ApiResultFormatModel} from "../model/common/ApiResultFormatModel";

@Injectable({
  providedIn: 'root',
})
export class UserService {
  BASEURL = '';
  constructor(private http: HttpClient) {
    this.BASEURL = environment.baseURL;
  }
  getUsers(): Observable<any[]> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('token'));
    return this.http.get<any[]>(this.BASEURL + 'user/all', { headers });
  }
  getPassengers(): Observable<ApiResultFormatModel> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('token'));
    return this.http.get<ApiResultFormatModel>(this.BASEURL + 'user/passengers', { headers });
  }

  updateUser( body: any) {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('token'));
    return this.http.put<any>(this.BASEURL+'user/update', body,{ headers });

  }

  findUserDetailByCode( body: any) {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('token'));
    return this.http.post<any>(this.BASEURL+'user/by/code', body,{ headers });

  }

  otpSend( body: any) {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('token'));
    return this.http.post<any>(this.BASEURL+'user/otpSend', body,{ headers });

  }
}
