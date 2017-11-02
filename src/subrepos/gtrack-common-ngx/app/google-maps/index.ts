import { Injectable } from '@angular/core';
import * as loadGoogleMapsAPI from 'load-google-maps-api';
import { IGoogleMapsConfig, CommonConfig } from '../config';
import { /**/ } from '@types/googlemaps';

@Injectable()
export class GoogleMapsService {
  public map: Promise<google.maps.Map>;
  private _config: IGoogleMapsConfig;

  constructor(commonConfig: CommonConfig) {
    this._config = commonConfig.googleMaps;
    this.map = loadGoogleMapsAPI(this._config);
  }
}
