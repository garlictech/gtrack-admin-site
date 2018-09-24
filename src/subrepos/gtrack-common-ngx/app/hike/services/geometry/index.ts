import { Injectable } from '@angular/core';
import { point as turfPoint, featureCollection as turfFeatureCollection } from '@turf/helpers';
import nearestPointOnLine from '@turf/nearest-point-on-line';
import circle from '@turf/circle';
import distance from '@turf/distance';
import envelope from '@turf/envelope';
import midpoint from '@turf/midpoint';

export interface GeoPoint {
  lat: number;
  long: number;
}

export const EARTH_RADIUS = 6371000;

export interface CenterRadius {
  radius: number;
  center: GeoJSON.Feature<GeoJSON.Point>;
}

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
    return (n * Math.PI) / 180;
  }

  public distanceFromRoute(lonLat, path) {
    const point = turfPoint(lonLat);
    const p2 = nearestPointOnLine(path, point);
    return Math.round(1000 * distance(point, p2, { units: 'kilometers' }));
  }

  public getCenterRadius(bounds): CenterRadius {
    const p1 = this.getPoint(bounds.SouthWest.lon, bounds.SouthWest.lat);
    const p2 = this.getPoint(bounds.NorthEast.lon, bounds.NorthEast.lat);

    return {
      radius: distance(p1, p2, { units: 'kilometers' }) * 500,
      center: <GeoJSON.Feature<GeoJSON.Point>>midpoint(p1, p2)
    };
  }

  public doEnvelope(points: GeoJSON.Position[]): [GeoJSON.Position, GeoJSON.Position] {
    const features: GeoJSON.Feature<GeoJSON.Point>[] = points.map(point => this.getPoint(point[0], point[1]));

    const featureCollection = turfFeatureCollection(features);
    const env = envelope(featureCollection);
    const coordinates = env.geometry.coordinates[0];

    return [[coordinates[0][1], coordinates[0][0]], [coordinates[2][1], coordinates[2][0]]];
  }

  public envelopeCircle(center: GeoJSON.Position, radius: number): [GeoJSON.Position, GeoJSON.Position] {
    const centerPoint = this.getPoint(center[0], center[1]);
    const crcl = circle(centerPoint, Math.ceil(radius / 1000));
    const env = envelope(crcl);
    const coordinates = env.geometry.coordinates[0];

    return [[coordinates[0][1], coordinates[0][0]], [coordinates[2][1], coordinates[2][0]]];
  }
}
