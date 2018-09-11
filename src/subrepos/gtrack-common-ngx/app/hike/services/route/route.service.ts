import { Injectable } from '@angular/core';
import * as d3 from 'd3';
import { DeepstreamService } from 'subrepos/deepstream-ngx';
import { IRoute, IRouteStored, IRouteSaveResponse, EObjectState } from 'subrepos/provider-client';
import { Observable } from 'rxjs';

import { Route } from './route';

import { CenterRadius, GeometryService } from '../geometry';

export interface IBounds {
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
  constructor(private _deepstream: DeepstreamService, private _geometryService: GeometryService) {}

  public get(id: string): Observable<IRouteStored | null> {
    return this._deepstream
      .getRecord<IRouteStored>(`routes/${id}`)
      .get()
      .take(1);
  }

  public create(route: IRoute) {
    return this._deepstream.callRpc<IRouteSaveResponse>('admin.route.save', route);
  }

  public updateState(id: string, state: EObjectState) {
    return this._deepstream
      .callRpc('admin.state', {
        id: id,
        table: 'routes',
        state: state
      })
      .take(1);
  }

  public getBounds(track: GeoJSON.FeatureCollection<any>): IBounds {
    const d3Bounds = d3.geoBounds(track.features[0]);
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
  public splitBounds(bounds, maxRadius, boundsArr) {
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

  public getTrackPoint(route: Route, index: number) {
    return route.path.coordinates[index];
  }
}

export { Route };
