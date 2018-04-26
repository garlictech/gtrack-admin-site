import { Injectable } from '@angular/core';

import * as turf from '@turf/turf';

@Injectable()
export class GeospatialService {

  /**
   * Snap points to the given line and return with the segment's length
   * Use [lon, lat] coords!
   */
  public distanceOnLine(startCoords: number[], endCoords: number[], path: GeoJSON.Feature<GeoJSON.LineString>) {
    const _line = turf.lineString(path.geometry.coordinates.map(coord => [coord[0], coord[1]]));

    const _sp = turf.point([startCoords[0], startCoords[1]]);
    const _snappedStartPoint = turf.nearestPointOnLine(_line, _sp);

    const _ep = turf.point([endCoords[0], endCoords[1]]);
    const _snappedEndPoint = turf.nearestPointOnLine(_line, _ep);

    const _lineSlice = turf.lineSlice(_snappedStartPoint, _snappedEndPoint, _line);

    return 1000 * turf.lineDistance(_lineSlice, {units: 'kilometers'});
  }
}