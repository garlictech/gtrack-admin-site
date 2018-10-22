import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { log } from 'app/log';

import * as loadGoogleMapsAPI from 'load-google-maps-api';

import { IGoogleMapsConfig, ISharedConfig, SHARED_CONFIG_TOKEN } from '../../config';

@Injectable()
export class GoogleMapsService {
  public map: Promise<google.maps.Map>;
  private _config: IGoogleMapsConfig;

  constructor(
    @Inject(SHARED_CONFIG_TOKEN) commonConfig: ISharedConfig,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    const isBrowser = isPlatformBrowser(platformId);
    this._config = commonConfig.googleMaps;

    if (isBrowser !== true) {
      log.warn('Google Maps is disabled in server mode');
      this.map = new Promise((resolve, reject) => {});
    } else {
      this.map = loadGoogleMapsAPI(this._config);
    }
  }

  autocomplete(element: HTMLInputElement) {
    return this.map.then(() => {
      return new google.maps.places.Autocomplete(element);
    });
  }
}
