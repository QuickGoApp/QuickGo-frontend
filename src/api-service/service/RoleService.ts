import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment.prod";
import {map, Observable} from "rxjs";
import {ApiResultFormatModel} from "../model/common/ApiResultFormatModel";
import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root',
})
export class RoleService{
  private BASEURL:string;
  constructor(private http:HttpClient) {
    this.BASEURL = environment.baseURL;
  }

  public getAllRollList(): Observable<ApiResultFormatModel> {
    return this.http.get<ApiResultFormatModel>('assets/JSON/roleList.json').pipe(
      map((roleList: ApiResultFormatModel) => {
        return roleList;
      })
    );
  }
}
