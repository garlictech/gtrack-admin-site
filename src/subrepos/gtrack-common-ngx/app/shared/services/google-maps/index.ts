import { Injectable, ElementRef } from '@angular/core';
import * as loadGoogleMapsAPI from 'load-google-maps-api';
import { IGoogleMapsConfig, SharedConfig } from '../../config';
import { /**/ } from '@types/googlemaps';

@Injectable()
export class GoogleMapsService {
  public map: Promise<google.maps.Map>;
  private _config: IGoogleMapsConfig;

  constructor(commonConfig: SharedConfig) {
    this._config = commonConfig.googleMaps;
    this.map = loadGoogleMapsAPI(this._config);
  }

  autocomplete(element: HTMLInputElement) {
    return this
      .map
      .then(() => {
        return new google.maps.places.Autocomplete(element);
      });
  }
}
