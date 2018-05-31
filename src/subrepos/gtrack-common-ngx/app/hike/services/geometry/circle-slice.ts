import { Injectable } from '@angular/core';
import * as turf from '@turf/turf';
import { CoordinateIterator } from './coordinate-iterator';

export class CircleSlice {
  constructor(
    private startPoint: GeoJSON.Feature<GeoJSON.Point>,
    private endPoint: GeoJSON.Feature<GeoJSON.Point>,
    private line: GeoJSON.Feature<GeoJSON.LineString>
  ) {}

  public get(): GeoJSON.Feature<GeoJSON.LineString> | null {
    let startVertex = turf.pointOnLine(this.line, this.startPoint);
    let stopVertex = turf.pointOnLine(this.line, this.endPoint);
    let clipLine: GeoJSON.Feature<GeoJSON.LineString>;
    let it: CoordinateIterator;
    let property = 'index';

    if (
      startVertex === null ||
      stopVertex === null ||
      this.line === null ||
      startVertex.geometry === null ||
      stopVertex.geometry === null ||
      this.line.geometry === null
    ) {
      return null;
    }

    clipLine = <GeoJSON.Feature<GeoJSON.LineString>>turf.lineString([startVertex.geometry.coordinates]);

    if (clipLine === null || clipLine.geometry === null) {
      return null;
    }

    it = new CoordinateIterator(this.line.geometry.coordinates);

    it.start(startVertex.properties[property]);

    while (it.at() && !stopVertex.properties[property] && !it.end()) {
      let next = it.next();

      if (next !== null) {
        clipLine.geometry.coordinates.push(next);
      }
    }

    clipLine.geometry.coordinates.push(stopVertex.geometry.coordinates);

    return clipLine;
  }
}
