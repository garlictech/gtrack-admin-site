import { Injectable } from '@angular/core';

export type GeoPoint = {
  lat: number;
  long: number;
};

export const EARTH_RADIUS = 6371000;

@Injectable()
export class GeometryService {

  protected getPoint(lon: number, lat: number): GeoJSON.Feature<GeoJSON.Point> {
    return {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [lon, lat],
      },
      properties: null
    };
  }

  public toRadian(n: number): number {
    return (n * Math.PI) / 180;
  }
}
