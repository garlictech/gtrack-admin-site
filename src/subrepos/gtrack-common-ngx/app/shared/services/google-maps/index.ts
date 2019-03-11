import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { log } from 'app/log';

import * as loadGoogleMapsAPI from 'load-google-maps-api';

import { GoogleMapsConfig, SHARED_CONFIG_TOKEN, SharedConfig } from '../../config';

@Injectable()
export class GoogleMapsService {
  map: Promise<google.maps.Map>;
  private readonly _config: GoogleMapsConfig;

  constructor(@Inject(SHARED_CONFIG_TOKEN) commonConfig: SharedConfig, @Inject(PLATFORM_ID) platformId: object) {
    const isBrowser = isPlatformBrowser(platformId);
    this._config = commonConfig.googleMaps;

    if (!isBrowser) {
      log.warn('Google Maps is disabled in server mode');
      this.map = new Promise((resolve, reject) => undefined);
    } else {
      this.map = loadGoogleMapsAPI(this._config);
    }
  }

  async autocomplete(element: HTMLInputElement): Promise<any> {
    return this.map.then(() => new google.maps.places.Autocomplete(element));
  }
}
