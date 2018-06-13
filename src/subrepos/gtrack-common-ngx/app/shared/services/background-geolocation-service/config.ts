import { InjectionToken } from '@angular/core';

export interface IBackgroundGeolocationServiceConfig {
  debug: boolean;
}

export const BACKGROUND_GEOLOCATION_CONFIG_TOKEN = new InjectionToken<IBackgroundGeolocationServiceConfig>(
  'Background geolocation config'
);
