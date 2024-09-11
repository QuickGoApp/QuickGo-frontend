import {HttpClient, HttpHeaders} from "@angular/common/http";
import {catchError, map, Observable} from "rxjs";
import {ApiResultFormatModel} from "../../api-service/model/common/ApiResultFormatModel";
import {Injectable} from "@angular/core";
import {environment} from "../../environments/environment.prod";

@Injectable({
  providedIn: 'root',
})
export class CustomerService {

  BASEURL = '';
  constructor(private http: HttpClient) {
    this.BASEURL = environment.baseURL;
  }

  public getCustomerList(payload: any): Observable<ApiResultFormatModel> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('token'));
    return this.http.post<ApiResultFormatModel>(this.BASEURL+'customer/getAllCustomerList', payload, { headers });
  }

  saveCustomer(payLoad: any) {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('token'));
    return this.http.post<ApiResultFormatModel>(this.BASEURL+'customer/saveCustomer', payLoad, { headers });
  }

  getCustomerDetailByMobileNumOne(payLoad: any) {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('token'));
    return this.http.post<ApiResultFormatModel>(this.BASEURL+'customer/getCustomerDetailByMobileNumOne', payLoad, { headers });
  }

  getCustomerCount() {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('token'));
    return this.http.post<ApiResultFormatModel>(this.BASEURL+'customer/getCustomerCount', { headers });
  }

  deleteCustomer(id) {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('token'));
    return this.http.post<ApiResultFormatModel>(this.BASEURL+'customer/deleteCustomer/'+id, { headers });
  }
}
