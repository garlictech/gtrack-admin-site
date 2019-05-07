import { Injectable } from '@angular/core';

import { lineString as turfLineString, point as turfPoint } from '@turf/helpers';
import length from '@turf/length';
import lineSlice from '@turf/line-slice';
import nearestPointOnLine from '@turf/nearest-point-on-line';

@Injectable({
  providedIn: 'root'
})
export class GeospatialService {
  /**
   * Snap points to the given line and return with the segment
   * Use [lon, lat] coords!
   */
  snappedLineSlice(
    startCoords: Array<number>,
    endCoords: Array<number>,
    path: GeoJSON.Feature<GeoJSON.LineString>
  ): any {
    const _line = turfLineString(path.geometry.coordinates);
    const _sp = turfPoint([startCoords[0], startCoords[1]]);
    const _snappedStartPoint = nearestPointOnLine(_line, _sp);
    const _ep = turfPoint([endCoords[0], endCoords[1]]);
    const _snappedEndPoint = nearestPointOnLine(_line, _ep);

    return lineSlice(_snappedStartPoint, _snappedEndPoint, _line);
  }

  /**
   * Snap points to the given line and return with the segment's length
   * Use [lon, lat] coords!
   */
  distanceOnLine(
    startCoords: Array<number>,
    endCoords: Array<number>,
    path: GeoJSON.Feature<GeoJSON.LineString>
  ): number {
    const _lineSlice = this.snappedLineSlice(startCoords, endCoords, path);

    return length(_lineSlice, { units: 'kilometers' }) * 1000;
  }
}
