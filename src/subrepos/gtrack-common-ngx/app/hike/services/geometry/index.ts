import { Injectable } from '@angular/core';
import * as turf from '@turf/turf';

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

  public distanceFromRoute(lonLat, path) {
    let point = turf.point(lonLat);
    let p2 = turf.pointOnLine(path, point);
    return Math.round(1000 * turf.distance(point, p2, 'kilometers'));
  }

  public getCenterRadius(bounds) {
    const p1 = this.getPoint(bounds.SouthWest.lon, bounds.SouthWest.lat);
    const p2 = this.getPoint(bounds.NorthEast.lon, bounds.NorthEast.lat);

    return {
      radius: turf.distance(p1, p2, 'kilometers') * 500,
      center: turf.midpoint(p1, p2)
    }
  }
}
