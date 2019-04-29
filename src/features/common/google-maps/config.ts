import { InjectionToken } from '@angular/core';

export interface GoogleMapsConfig {
  key: string;
  libraries?: Array<string>;
  v?: string;
}

export interface SharedConfig {
  googleMaps: GoogleMapsConfig;
}

export const defaultSharedConfig: SharedConfig = {
  googleMaps: {
    key: 'AIzaSyANByCixyD2mLtE80aUooldhc3E9W1NqGQ',
    // key: 'AIzaSyAlBUYkm8VYLS1eeOL7rYdd7Sh0syilXL4', // gTrackDemo1 - Tamás
    libraries: ['geometry', 'places']
  }
};

export const SHARED_CONFIG_TOKEN = new InjectionToken<SharedConfig>('Shared config');
