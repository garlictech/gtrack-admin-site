import { Injectable } from '@angular/core';
import * as turf from '@turf/turf';

export type GeoPoint = {
  lat: number;
  long: number;
};

export const EARTH_RADIUS = 6371000;

export type CenterRadius = {
  radius: number;
  center: GeoJSON.Feature<GeoJSON.Point>;
};

@Injectable()
export class GeometryService {
  protected getPoint(lon: number, lat: number): GeoJSON.Feature<GeoJSON.Point> {
    return {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [lon, lat]
      },
      properties: null
    };
  }

  public toRadian(n: number): number {
    return n * Math.PI / 180;
  }

  public distanceFromRoute(lonLat, path) {
    let point = turf.point(lonLat);
    let p2 = turf.pointOnLine(path, point);
    return Math.round(1000 * turf.distance(point, p2, { units: 'kilometers' }));
  }

  public getCenterRadius(bounds): CenterRadius {
    const p1 = this.getPoint(bounds.SouthWest.lon, bounds.SouthWest.lat);
    const p2 = this.getPoint(bounds.NorthEast.lon, bounds.NorthEast.lat);

    return {
      radius: turf.distance(p1, p2, { units: 'kilometers' }) * 500,
      center: <GeoJSON.Feature<GeoJSON.Point>>turf.midpoint(p1, p2)
    };
  }

  public envelope(points: GeoJSON.Position[]): [GeoJSON.Position, GeoJSON.Position] {
    let features: GeoJSON.Feature<GeoJSON.Point>[] = points.map(point => this.getPoint(point[0], point[1]));

    let featureCollection = turf.featureCollection(features);
    let envelope = turf.envelope(featureCollection);
    let coordinates = envelope.geometry.coordinates[0];

    return [[coordinates[0][1], coordinates[0][0]], [coordinates[2][1], coordinates[2][0]]];
  }

  public envelopeCircle(center: GeoJSON.Position, radius: number): [GeoJSON.Position, GeoJSON.Position] {
    let centerPoint = this.getPoint(center[0], center[1]);
    let circle = turf.circle(centerPoint, Math.ceil(radius / 1000));
    let envelope = turf.envelope(circle);
    let coordinates = envelope.geometry.coordinates[0];

    return [[coordinates[0][1], coordinates[0][0]], [coordinates[2][1], coordinates[2][0]]];
  }
}
