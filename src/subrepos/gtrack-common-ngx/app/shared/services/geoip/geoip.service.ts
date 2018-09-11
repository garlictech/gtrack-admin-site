import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { environment } from 'environments/environment';

@Injectable()
export class GeoIpService {
  private _url: string;

  constructor(private _http: Http) {
    this._url = `${environment.lambdaEndpoint}/geoip`;
  }

  public getLocation() {
    return this._http.get(this._url);
  }
}
