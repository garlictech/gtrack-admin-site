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
      accuracy: number;
      latitude: number;
      longitude: number;
    }>(this._url);
  }
}
