import { Injectable } from '@angular/core';
import * as turf from '@turf/turf';
import { CoordinateIterator } from './coordinate-iterator';

export class CircleSlice {

  constructor(
    private startPoint: GeoJSON.Feature<GeoJSON.Point>,
    private endPoint: GeoJSON.Feature<GeoJSON.Point>,
    private line: GeoJSON.Feature<GeoJSON.LineString>
  ) {

  }

  public get(): GeoJSON.Feature<GeoJSON.LineString> {
    let startVertex: GeoJSON.Feature<GeoJSON.Point> = turf.pointOnLine(this.line, this.startPoint);
    let stopVertex: GeoJSON.Feature<GeoJSON.Point> = turf.pointOnLine(this.line, this.endPoint);
    let clipLine: GeoJSON.Feature<GeoJSON.LineString> = turf.lineString([startVertex.geometry.coordinates]);
    let it = new CoordinateIterator(this.line.geometry.coordinates);
    let property = 'index';

    it.start(startVertex.properties[property]);

    while (it.at() && !stopVertex.properties[property] && !it.end()) {
      clipLine.geometry.coordinates.push(it.next());
    }

    clipLine.geometry.coordinates.push(stopVertex.geometry.coordinates);

    return clipLine;
  }

}
