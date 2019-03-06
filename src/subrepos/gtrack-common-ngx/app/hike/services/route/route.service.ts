import { Injectable } from '@angular/core';
import { DeepstreamService } from '@features/common/deepstream-ngx';
import { EObjectState, RouteData, RouteSaveResponse, RouteStored } from '@features/common/gtrack-interfaces';
import { geoBounds as d3GeoBounds } from 'd3-geo';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { CenterRadius, GeometryService } from '../geometry';
import { Route } from './route';

export interface Bounds {
  NorthEast: {
    lat: number;
    lon: number;
  };
  SouthWest: {
    lat: number;
    lon: number;
  };
}

@Injectable()
export class RouteService {
  constructor(private readonly _deepstream: DeepstreamService, private readonly _geometryService: GeometryService) {}

  get(id: string): Observable<RouteStored | null> {
    return this._deepstream
      .getRecord<RouteStored>(`routes/${id}`)
      .get()
      .pipe(take(1));
  }

  create(route: RouteData): Observable<any> {
    return this._deepstream.callRpc<RouteSaveResponse>('admin.route.save', route);
  }

  updateState(id: string, state: EObjectState): Observable<any> {
    return this._deepstream
      .callRpc('admin.state', {
        id,
        table: 'routes',
        state
      })
      .pipe(take(1));
  }

  getBounds(track: GeoJSON.FeatureCollection<any>): Bounds {
    const d3Bounds = d3GeoBounds(track.features[0]);
    const padding = 0.003; // about 330m

    return {
      SouthWest: {
        lat: d3Bounds[0][1] + padding,
        lon: d3Bounds[0][0] + padding
      },
      NorthEast: {
        lat: d3Bounds[1][1] - padding,
        lon: d3Bounds[1][0] - padding
      }
    };
  }

  /**
   * e.g. Wikipedia API has a 10.000 m radius limit on the bounds..
   * So we have to pass gridded bounds if the original rectangle is too large
   *
   * Sample:
   * let boundsArr: any[] = [];
   * this._routeService.splitBounds(bounds, 10000, boundsArr);
   *
   * When the recursive function ends, the boundsArr will contains the correct bounds
   */
  splitBounds(bounds, maxRadius, boundsArr): void {
    const geo: CenterRadius = this._geometryService.getCenterRadius(bounds);

    if (geo.radius < maxRadius) {
      boundsArr.push(bounds);
    } else {
      // Chech quarter rectangles
      this.splitBounds(
        {
          SouthWest: { lat: bounds.SouthWest.lat, lon: bounds.SouthWest.lon },
          NorthEast: { lat: geo.center.geometry.coordinates[1], lon: geo.center.geometry.coordinates[0] }
        },
        maxRadius,
        boundsArr
      );
      this.splitBounds(
        {
          SouthWest: { lat: geo.center.geometry.coordinates[1], lon: bounds.SouthWest.lon },
          NorthEast: { lat: bounds.NorthEast.lat, lon: geo.center.geometry.coordinates[0] }
        },
        maxRadius,
        boundsArr
      );
      this.splitBounds(
        {
          SouthWest: { lat: bounds.SouthWest.lat, lon: geo.center.geometry.coordinates[0] },
          NorthEast: { lat: geo.center.geometry.coordinates[1], lon: bounds.NorthEast.lon }
        },
        maxRadius,
        boundsArr
      );
      this.splitBounds(
        {
          SouthWest: { lat: geo.center.geometry.coordinates[1], lon: geo.center.geometry.coordinates[0] },
          NorthEast: { lat: bounds.NorthEast.lat, lon: bounds.NorthEast.lon }
        },
        maxRadius,
        boundsArr
      );
    }
  }

  getTrackPoint(route: Route, index: number): any {
    return route.path.coordinates[index];
  }
}

export { Route };
