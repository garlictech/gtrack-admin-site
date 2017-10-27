import { Injectable } from '@angular/core';
import * as d3 from 'd3';
import * as turf from '@turf/turf';

import { Observable } from 'rxjs/Observable';

import { Route } from './route';
import { UnitsService } from '../units';

import { DeepstreamService } from '../../subrepos/deepstream-ngx';

export interface IElevationMargin {
  top: number;
  right: number;
  bottom: number;
  left: number;
};

export interface IElavationData {
  highestElevation: number;
  lowestElevation: number;
  xRange: d3.ScaleLinear<number, number>;
  yRange: d3.ScaleLinear<number, number>;
  lineData: [number, number][];
  lineFunc: d3.Line<[number, number]>;
};

export interface IBounds {
  NorthEast: {
    lat: number,
    lon: number
  },
  SouthWest: {
    lat: number,
    lon: number
  }
}

@Injectable()
export class RouteService {

  constructor(
    private _deepstream: DeepstreamService,
    private unitsService: UnitsService
  ) { }

  public get(id: string): Observable<Route> {
    return this._deepstream
      .getRecord(`routes/${id}`)
      .get()
      .map((data: any) => {
        if (data.$value === null) {
          throw new Error('No data with this id');
        }

        return new Route({
          id: data.id,
          bounds: data.bounds,
          path: data.route.features[0].geometry,
          geojson: data.route
        });
      });
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
  ): IElavationData {
    let lineData: [number, number][] = [];
    let distance = 0;

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
          coordinates: [
            previous[0],
            previous[1]
          ]
        };

        currentPoint = {
          type: 'Point',
          coordinates: [
           coordinate[0],
           coordinate[1]
          ]
        };

        distance += turf.distance(currentPoint, previousPoint) * 1000;

        lineData.push([
          this.unitsService.convertDistanceInBigUnit(distance).value,
          this.unitsService.convertDistance(coordinate[2], true).value
        ]);
      }
    });

    let xRangeMin = d3.min(lineData, (d) => d[0]);
    let xRangeMax = d3.max(lineData, (d) => d[0]);
    let yRangeMin = d3.min(lineData, (d) => d[1]);
    let yRangeMax = d3.max(lineData, (d) => d[1]);

    let xRange = d3
      .scaleLinear()
      .range([margins.left, width - margins.right])
      .domain([xRangeMin, xRangeMax]);

    let yRange = d3
      .scaleLinear()
      .range([height - margins.top, margins.bottom])
      .domain([yRangeMin, yRangeMax]);

    return {
      highestElevation: yRangeMax,
      lowestElevation: yRangeMin,
      xRange: xRange,
      yRange: yRange,
      lineData: lineData,
      lineFunc: d3.line()
        .x((d) => xRange(d[0]))
        .y((d) => yRange(d[1]))
        .curve(d3.curveBasis)
    };
  }

  public getBounds(track): IBounds {
    let d3Bounds = d3.geoBounds(track.features[0]);
    let padding = 0.003; // about 330m

    return {
      NorthEast: {
        lat: d3Bounds[0][1] - padding,
        lon: d3Bounds[0][0] - padding
      },
      SouthWest: {
        lat: d3Bounds[1][1] + padding,
        lon: d3Bounds[1][0] + padding
      }
    }
  }
}

export { Route };
