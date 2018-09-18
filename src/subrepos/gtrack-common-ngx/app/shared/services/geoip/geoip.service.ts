import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';

@Injectable()
export class GeoIpService {
  private _url: string;

  constructor(private _http: HttpClient) {
    this._url = `${environment.lambdaEndpoint}/geoip`;
  }

  public getLocation() {
    return this._http.get<{
<<<<<<< HEAD
      accuracy: number;
      latitude: number;
      longitude: number;
=======
      accuracy: number,
      latitude: number,
      longitude: number
>>>>>>> 812629b4063c7346ab03802170a17ea5c904c661
    }>(this._url);
  }
}
