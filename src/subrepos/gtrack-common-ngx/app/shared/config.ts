import { InjectionToken } from '@angular/core';

export interface IGoogleMapsConfig {
  key: string;
  libraries?: string[];
  v?: string;
}

export interface ISharedConfig {
  googleMaps: IGoogleMapsConfig;
}

export const defaultSharedConfig: ISharedConfig = {
  googleMaps: {
    key: 'AIzaSyANByCixyD2mLtE80aUooldhc3E9W1NqGQ',
    // key: 'AIzaSyAlBUYkm8VYLS1eeOL7rYdd7Sh0syilXL4', // gTrackDemo1 - Tamás
    libraries: ['geometry', 'places']
  }
};

export const SHARED_CONFIG_TOKEN = new InjectionToken<ISharedConfig>('Shared config');
