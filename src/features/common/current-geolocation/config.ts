import { InjectionToken } from '@angular/core';

export interface CurrentGeolocationConfig {
  debug: boolean;
  interval: number;
  minDistance: number;
}

export interface GeoIpConfig {
  endpoint: string;
}
export interface GeoTimeOutConfig {
  timeOut: number;
}

export const CURRENT_GEOLOCATION_CONFIG = new InjectionToken<CurrentGeolocationConfig>('Current geolocation config');

export const GEO_TIMEOUT_CONFIG = new InjectionToken<GeoTimeOutConfig>('Geolocation timeout');

export const GEO_IP_CONFIG = new InjectionToken<GeoIpConfig>('GeoIp endpoint config');
