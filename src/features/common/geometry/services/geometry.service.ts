import { Injectable } from '@angular/core';
import circle from '@turf/circle';
import distance from '@turf/distance';
import envelope from '@turf/envelope';
import { featureCollection as turfFeatureCollection, point as turfPoint } from '@turf/helpers';
import midpoint from '@turf/midpoint';
import nearestPointOnLine from '@turf/nearest-point-on-line';

export interface GeoPoint {
  lat: number;
  long: number;
}

export const EARTH_RADIUS = 6371000;

export interface CenterRadius {
  radius: number;
  center: GeoJSON.Feature<GeoJSON.Point>;
}

@Injectable({
  providedIn: 'root'
})
export class GeometryService {
  protected getPoint(lon: number, lat: number): GeoJSON.Feature<GeoJSON.Point> {
    return {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [lon, lat]
      },
      properties: undefined
    };
  }

  protected _getLineString(line: GeoJSON.LineString): GeoJSON.Feature<GeoJSON.LineString> {
    return {
      type: 'Feature',
      geometry: line,
      properties: undefined
    };
  }

  toRadian(n: number): number {
    return (n * Math.PI) / 180;
  }

  distanceFromRoute(lonLat, path): number {
    const point = turfPoint(lonLat);
    const p2 = nearestPointOnLine(path, point);

    return Math.round(distance(point, p2, { units: 'kilometers' }) * 1000);
  }

  getCenterRadius(bounds): CenterRadius {
    const p1 = this.getPoint(bounds.SouthWest.lon, bounds.SouthWest.lat);
    const p2 = this.getPoint(bounds.NorthEast.lon, bounds.NorthEast.lat);

    return {
      radius: distance(p1, p2, { units: 'kilometers' }) * 500,
      center: midpoint(p1, p2) as GeoJSON.Feature<GeoJSON.Point>
    };
  }

  doEnvelope(points: Array<GeoJSON.Position>): [GeoJSON.Position, GeoJSON.Position] {
    const features: Array<GeoJSON.Feature<GeoJSON.Point>> = points.map(point => this.getPoint(point[0], point[1]));

    const featureCollection = turfFeatureCollection(features);
    const env = envelope(featureCollection);
    const coordinates = env.geometry.coordinates[0];

    return [[coordinates[0][1], coordinates[0][0]], [coordinates[2][1], coordinates[2][0]]];
  }

  doPathEnvelope(paths: Array<GeoJSON.LineString>): [GeoJSON.Position, GeoJSON.Position] {
    const features: Array<GeoJSON.Feature<GeoJSON.LineString>> = paths.map(path => this._getLineString(path));

    const featureCollection = turfFeatureCollection(features);
    const env = envelope(featureCollection);
    const coordinates = env.geometry.coordinates[0];

    return [[coordinates[0][1], coordinates[0][0]], [coordinates[2][1], coordinates[2][0]]];
  }

  envelopeCircle(center: GeoJSON.Position, radius: number): [GeoJSON.Position, GeoJSON.Position] {
    const centerPoint = this.getPoint(center[0], center[1]);
    const crcl = circle(centerPoint, Math.ceil(radius / 1000));
    const env = envelope(crcl);
    const coordinates = env.geometry.coordinates[0];

    return [[coordinates[0][1], coordinates[0][0]], [coordinates[2][1], coordinates[2][0]]];
  }
}
