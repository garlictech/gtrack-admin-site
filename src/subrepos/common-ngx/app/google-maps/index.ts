import { Injectable } from '@angular/core';
import loadGoogleMapsAPI from 'load-google-maps-api';
import { IGoogleMapsConfig, CommonConfig } from '../config';

@Injectable()
export class GoogleMapsService {
  public map: Promise<any>;
  private _config: IGoogleMapsConfig;

  constructor(private commonConfig: CommonConfig) {
    this._config = commonConfig.googleMaps;
    this.map = loadGoogleMapsAPI(this._config);
  }
}
