import { lineString as turfLineString } from '@turf/helpers';
import nearestPointOnLine from '@turf/nearest-point-on-line';
import { CoordinateIterator } from './coordinate-iterator';

export class CircleSlice {
  constructor(
    private readonly startPoint: GeoJSON.Feature<GeoJSON.Point>,
    private readonly endPoint: GeoJSON.Feature<GeoJSON.Point>,
    private readonly line: GeoJSON.Feature<GeoJSON.LineString>
  ) {}

  get(): GeoJSON.Feature<GeoJSON.LineString> | null {
    const startVertex = nearestPointOnLine(this.line, this.startPoint);
    const stopVertex = nearestPointOnLine(this.line, this.endPoint);
    let clipLine: GeoJSON.Feature<GeoJSON.LineString>;
    let it: CoordinateIterator;
    const property = 'index';

    if (
      startVertex === null ||
      stopVertex === null ||
      this.line === null ||
      startVertex.geometry === null ||
      stopVertex.geometry === null ||
      this.line.geometry === null
    ) {
      return undefined;
    }

    clipLine = turfLineString([startVertex.geometry.coordinates]) as GeoJSON.Feature<GeoJSON.LineString>;

    if (clipLine === null || clipLine.geometry === null) {
      return undefined;
    }

    it = new CoordinateIterator(this.line.geometry.coordinates);

    it.start(startVertex.properties[property]);

    while (it.at() && !stopVertex.properties[property] && !it.end()) {
      const next = it.next();

      if (next !== null) {
        clipLine.geometry.coordinates.push(next);
      }
    }

    clipLine.geometry.coordinates.push(stopVertex.geometry.coordinates);

    return clipLine;
  }
}
