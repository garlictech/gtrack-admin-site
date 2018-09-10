import { Injectable } from '@angular/core';
import * as d3 from 'd3';
import distance from '@turf/distance';

import { Observable } from 'rxjs';

import { Route } from './route';
import { UnitsService } from '../../../shared';

import { DeepstreamService } from '../../../../../deepstream-ngx';
import { ScaleLinear } from 'd3';
import { IRoute, IRouteStored, IRouteSaveResponse, EObjectState } from '../../../../../provider-client';
import { CenterRadius, GeometryService } from '../geometry';

export interface IElevationMargin {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface IElevationData {
  highestElevation: number;
  lowestElevation: number;
  xRange: d3.ScaleLinear<number, number>;
  yRange: d3.ScaleLinear<number, number>;
  lineData: [number, number][];
  lineFunc: d3.Line<[number, number]>;
}

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
  constructor(
    private _deepstream: DeepstreamService,
    private unitsService: UnitsService,
    private _geometryService: GeometryService
  ) {}

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

  public elevationData(
    route: Route,
    width: number,
    height: number,
    margins: IElevationMargin = {
      top: 0,
      left: 0,
      right: 0,
      bottom: 0
    }
  ): IElevationData | null {
    let lineData: [number, number][] = [];
    let dist = 0;

    route.path.coordinates.forEach((coordinate: [number, number], i: number) => {
      let previous: GeoJSON.Position;

      if (i === 0) {
        lineData.push([0, this.unitsService.convertDistance(coordinate[2], true).value]);
      } else {
        let previousPoint: GeoJSON.Point;
        let currentPoint: GeoJSON.Point;

        previous = route.path.coordinates[i - 1];

        previousPoint = {
          type: 'Point',
          coordinates: [previous[0], previous[1]]
        };

        currentPoint = {
          type: 'Point',
          coordinates: [coordinate[0], coordinate[1]]
        };

        dist += distance(currentPoint, previousPoint) * 1000;

        lineData.push([
          this.unitsService.convertDistanceInBigUnit(dist).value,
          this.unitsService.convertDistance(coordinate[2], true).value
        ]);
      }
    });

    const xRangeMin = d3.min(lineData, d => d[0]);
    const xRangeMax = d3.max(lineData, d => d[0]);
    const yRangeMin = d3.min(lineData, d => d[1]);
    const yRangeMax = d3.max(lineData, d => d[1]);

    let xRange: ScaleLinear<number, number>;
    let yRange: ScaleLinear<number, number>;

    if (typeof xRangeMin === 'undefined' || typeof xRangeMax === 'undefined') {
      return null;
    }

    xRange = d3
      .scaleLinear()
      .range([margins.left, width - margins.right])
      .domain([xRangeMin, xRangeMax]);

    if (typeof yRangeMin === 'undefined' || typeof yRangeMax === 'undefined') {
      return null;
    }

    yRange = d3
      .scaleLinear()
      .range([height - margins.top, margins.bottom])
      .domain([yRangeMin, yRangeMax]);

    return {
      highestElevation: yRangeMax,
      lowestElevation: yRangeMin,
      xRange: xRange,
      yRange: yRange,
      lineData: lineData,
      lineFunc: d3
        .line()
        .x(d => xRange(d[0]))
        .y(d => yRange(d[1]))
        .curve(d3.curveBasis)
    };
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
