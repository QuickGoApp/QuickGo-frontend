import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {environment} from "../../environments/environment.prod";
import {Observable} from "rxjs";
import {ApiResultFormatModel} from "../model/common/ApiResultFormatModel";


@Injectable({
  providedIn: 'root',
})
export class PrivilegeService {
  SERVER = '';
  constructor(private http: HttpClient) {
    this.SERVER = environment.baseURL;
  }


  getAllPrivileges() {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('token'));
    return this.http.post<any>(environment.baseURL + 'privilege/getAllPrivileges', null, {headers});
  }


  assignPrivileges(payload: any) {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('token'));
    return this.http.post<any>(environment.baseURL + 'privilege/assignPrivileges', payload, {headers});
  }

  public getRoleWisePrivilege(payload: any): Observable<ApiResultFormatModel> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('token'));
    return this.http.post<ApiResultFormatModel>(this.SERVER + 'privilege/getRoleWisePrivileges', payload, { headers });
  }

}
