import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../environments/environment.prod";
import {Injectable} from "@angular/core";
import {ApiResultFormatModel} from "../model/common/ApiResultFormatModel";
import {map, Observable} from "rxjs";

@Injectable({
  providedIn: 'root',
})
export  class DriverService {
  private BASEURL:string;
  constructor(private http:HttpClient) {
    this.BASEURL = environment.baseURL;
  }

  public getVehicleTypes(): Observable<ApiResultFormatModel> {
    return this.http.get<ApiResultFormatModel>('assets/JSON/vehicleType.json').pipe(
      map((vehicleTypes: ApiResultFormatModel) => {
        return vehicleTypes;
      })
    );
  }

  public getActiveVehicle(): Observable<ApiResultFormatModel> {
    return this.http.get<ApiResultFormatModel>('assets/JSON/activeVehicle.json').pipe(
      map((activeVehicles: ApiResultFormatModel) => {
        return activeVehicles;
      })
    );
  }
}
