import { Injectable, Inject } from '@angular/core';
import * as loadGoogleMapsAPI from 'load-google-maps-api';
import { IGoogleMapsConfig, ISharedConfig, SHARED_CONFIG_TOKEN } from '../../config';
<<<<<<< HEAD
import /* Empty */ '@types/googlemaps';
=======
import { /* Empty */ } from '@types/googlemaps';
>>>>>>> 812629b4063c7346ab03802170a17ea5c904c661

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
