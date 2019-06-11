import { GoogleMapsService } from '@bit/garlictech.angular-features.common.google-maps';
import { Route } from '@bit/garlictech.angular-features.common.route';
import { UnitsService } from '@bit/garlictech.angular-features.common.units';
import { max as d3max, min as d3min } from 'd3-array';
import { ScaleLinear as D3ScaleLinear, scaleLinear as d3ScaleLinear } from 'd3-scale';
import { Area as D3Area, area as d3Area, curveBasis as d3CurveBasis, Line as D3Line, line as d3Line } from 'd3-shape';

import { Injectable } from '@angular/core';
import distance from '@turf/distance';

export interface ElevationData {
  highestElevation: number;
  lowestElevation: number;
  xRange: D3ScaleLinear<number, number>;
  yRange: D3ScaleLinear<number, number>;
  lineData: Array<[number, number]>;
  lineFunc: D3Line<[number, number]>;
  areaFunc: D3Area<[number, number]>;
}

export interface ElevationMargin {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

const calculateHill = (data: Array<Array<number>>, bigEnough: (diff: number) => boolean, multiplier = 1): number => {
  let sum = 0;

  data.forEach((point, i) => {
    if (i > 0) {
      const diff = point[2] - data[i - 1][2];

      if (bigEnough(diff)) {
        sum += diff * multiplier;
      }
    }
  });

  return sum;
};

@Injectable({
  providedIn: 'root'
})
export class ElevationService {
  constructor(private readonly googleMapsService: GoogleMapsService, private readonly unitsService: UnitsService) {}

  calculateUphill(data: Array<Array<number>>): number {
    return calculateHill(data, diff => diff > 0);
  }

  calculateDownhill(data: Array<Array<number>>): number {
    return calculateHill(data, diff => diff < 0, -1);
  }

  async getData(coordinates: Array<Array<number>>): Promise<Array<Array<number>>> {
    return this.googleMapsService.map.then(async () => {
      const locations: Array<google.maps.LatLng> = coordinates.map(
        (coordinate: Array<number>) => new google.maps.LatLng(coordinate[0], coordinate[1])
      );

      const elevationService: google.maps.ElevationService = new google.maps.ElevationService();
      const request: google.maps.LocationElevationRequest = {
        locations
      };

      return new Promise<Array<Array<number>>>((resolve, reject) => {
        elevationService.getElevationForLocations(
          request,
          (results: Array<google.maps.ElevationResult>, status: google.maps.ElevationStatus) => {
            if (status === google.maps.ElevationStatus.OK) {
              const elevations: Array<Array<number>> = results.map((point: google.maps.ElevationResult) => [
                point.location.lat(),
                point.location.lng(),
                point.elevation
              ]);

              resolve(elevations);
            } else {
              // Return with the original coordinates and 0 elevation
              resolve(coordinates.map(coord => [coord[0], coord[1], 0]));
            }
          }
        );
      });
    });
  }

  getd3ElevationData(
    route: Route,
    width: number,
    height: number,
    margins: ElevationMargin = {
      top: 0,
      left: 0,
      right: 0,
      bottom: 0
    }
  ): ElevationData | undefined {
    const lineData: Array<[number, number]> = [];
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

    const xRangeMin = d3min(lineData, d => d[0]);
    const xRangeMax = d3max(lineData, d => d[0]);
    const yRangeMin = d3min(lineData, d => d[1]);
    const yRangeMax = d3max(lineData, d => d[1]);

    let xRange: D3ScaleLinear<number, number>;
    let yRange: D3ScaleLinear<number, number>;

    if (typeof xRangeMin === 'undefined' || typeof xRangeMax === 'undefined') {
      return undefined;
    }

    xRange = d3ScaleLinear()
      .range([margins.left, width - margins.right])
      .domain([xRangeMin, xRangeMax]);

    if (typeof yRangeMin === 'undefined' || typeof yRangeMax === 'undefined') {
      return undefined;
    }

    const yGridUnit = (yRangeMax - yRangeMin) / 10;

    // The human factor: if the hike is flat (variation is only a couple of meters), we flatten the elevation profile
    // to make the users sense this fact.
    // So, if the altitude difference between the top/bottom points is less than 400m, we gradually introduce a compression
    // of the graph. After 400 m, the graph is intact.
    const compressionConstant = this.unitsService.convertDistance(400, true).value;
    const compressionParameter = Math.max((compressionConstant - (yRangeMax - yRangeMin)) / 2, 0);

    yRange = d3ScaleLinear()
      .range([height - margins.top, margins.bottom])
      .domain([yRangeMin - yGridUnit - compressionParameter, yRangeMax + yGridUnit + compressionParameter]);

    return {
      highestElevation: yRangeMax,
      lowestElevation: yRangeMin,
      xRange,
      yRange,
      lineData,
      lineFunc: d3Line()
        .x(d => xRange(d[0]))
        .y(d => yRange(d[1]))
        .curve(d3CurveBasis),
      areaFunc: d3Area()
        .x(d => xRange(d[0]))
        .y0(height - margins.bottom)
        .y1(d => yRange(d[1]))
        .curve(d3CurveBasis)
    };
  }
}
