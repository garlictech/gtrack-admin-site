import { Injectable } from '@angular/core';
import * as d3 from 'd3';
import { ScaleLinear } from 'd3';
import distance from '@turf/distance';

import { GoogleMapsService, UnitsService } from '../../../shared';
import { Route } from '../route';

export interface IElevationData {
  highestElevation: number;
  lowestElevation: number;
  xRange: d3.ScaleLinear<number, number>;
  yRange: d3.ScaleLinear<number, number>;
  lineData: [number, number][];
  lineFunc: d3.Line<[number, number]>;
  areaFunc: d3.Area<[number, number]>;
}

export interface IElevationMargin {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

@Injectable()
export class ElevationService {
  constructor(private googleMapsService: GoogleMapsService, private unitsService: UnitsService) {}

  public calculateUphill(data: number[][]): number {
    return this._calculateHill(data, diff => diff > 0);
  }

  public calculateDownhill(data: number[][]): number {
    return this._calculateHill(data, diff => diff < 0, -1);
  }

  public getData(coordinates: number[][]): Promise<number[][]> {
    return this.googleMapsService.map.then(() => {
      const locations: google.maps.LatLng[] = coordinates.map((coordinate: number[]) => {
        return new google.maps.LatLng(coordinate[0], coordinate[1]);
      });

      const elevationService: google.maps.ElevationService = new google.maps.ElevationService();
      const request: google.maps.LocationElevationRequest = {
        locations: locations
      };

      return new Promise<number[][]>((resolve, reject) => {
        elevationService.getElevationForLocations(
          request,
          (results: google.maps.ElevationResult[], status: google.maps.ElevationStatus) => {
            if (status === google.maps.ElevationStatus.OK) {
              const elevations: number[][] = results.map((point: google.maps.ElevationResult) => {
                return [point.location.lat(), point.location.lng(), point.elevation];
              });

              resolve(elevations);
            } else {
              // Return with the original coordinates and 0 elevation
              resolve(coordinates.map(coord => [coord[0], coord[1], 0]));
              // reject(status);
            }
          }
        );
      });
    });
  }

  public getd3ElevationData(
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
    const lineData: [number, number][] = [];
    let dist = 0;

    route.path.coordinates.forEach((coordinate: [number, number, number], i: number) => {
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

    const yGridUnit = (yRangeMax - yRangeMin) / 10;

    // The human factor: if the hike is flat (variation is only a couple of meters), we flatten the elevation profile
    // to make the users sense this fact.
    // So, if the altitude difference between the top/bottom points is less than 400m, we gradually introduce a compression
    // of the graph. After 400 m, the graph is intact.
    const compressionConstant = this.unitsService.convertDistance(400, true).value;
    const compressionParameter = Math.max((compressionConstant - (yRangeMax - yRangeMin)) / 2, 0);

    yRange = d3
      .scaleLinear()
      .range([height - margins.top, margins.bottom])
      .domain([yRangeMin - yGridUnit - compressionParameter, yRangeMax + yGridUnit + compressionParameter]);

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
        .curve(d3.curveBasis),
      areaFunc: d3
        .area()
        .x(d => xRange(d[0]))
        .y0(height - margins.bottom)
        .y1(d => yRange(d[1]))
        .curve(d3.curveBasis)
    };
  }

  private _calculateHill(data: number[][], bigEnough: ((diff: number) => boolean), multiplier = 1): number {
    let sum = 0;

    data.forEach((point, i) => {
      if (i > 0) {
        const diff = point[2] - data[i - 1][2];

        if (bigEnough(diff) === true) {
          sum += diff * multiplier;
        }
      }
    });

    return sum;
  }
}
