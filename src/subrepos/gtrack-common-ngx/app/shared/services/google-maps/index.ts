import { Injectable, ElementRef, Inject } from '@angular/core';
import * as loadGoogleMapsAPI from 'load-google-maps-api';
import { IGoogleMapsConfig, ISharedConfig, SHARED_CONFIG_TOKEN } from '../../config';
import {} from '@types/googlemaps';

@Injectable()
export class GoogleMapsService {
  public map: Promise<google.maps.Map>;
  private _config: IGoogleMapsConfig;

  constructor(@Inject(SHARED_CONFIG_TOKEN) commonConfig: ISharedConfig) {
    this._config = commonConfig.googleMaps;
    this.map = loadGoogleMapsAPI(this._config);
  }

  autocomplete(element: HTMLInputElement) {
    return this.map.then(() => {
      return new google.maps.places.Autocomplete(element);
    });
  }
}
