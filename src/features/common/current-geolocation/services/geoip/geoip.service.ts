import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GEO_IP_CONFIG, GeoIpConfig } from '../../config';

@Injectable()
export class GeoIpService {
  private readonly _url: string;

  constructor(private readonly _http: HttpClient, @Inject(GEO_IP_CONFIG) private readonly _config: GeoIpConfig) {
    this._url = `${this._config.endpoint}/geoip`;
  }

  getLocation(): Observable<{ accuracy: number; latitude: number; longitude: number }> {
    return this._http.get<{
      accuracy: number;
      latitude: number;
      longitude: number;
    }>(this._url);
  }
}
