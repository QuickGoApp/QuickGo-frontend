import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { ApiResultFormatModel } from "../../api-service/model/common/ApiResultFormatModel";
import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment.prod";
import { TripReportRequestModel } from "../model/report/TripReportRequestModel";

@Injectable({
    providedIn: 'root',
})
export class ReportService {

    BASEURL = '';
    constructor(private http: HttpClient) {
        this.BASEURL = environment.baseURL;
    }

    public getTripReport(payload: TripReportRequestModel): Observable<ApiResultFormatModel> {
        const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('token'));
        return this.http.post<ApiResultFormatModel>(this.BASEURL + 'report/admin/trip', payload, { headers });
    }

}
