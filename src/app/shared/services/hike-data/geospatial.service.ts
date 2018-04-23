import { Injectable } from '@angular/core';

import * as turf from '@turf/turf';

@Injectable()
export class GeospatialService {

  public distanceOnLine(spCoords: number[], epCoords: number[], path: GeoJSON.Feature<GeoJSON.LineString>) {
    const _line = turf.lineString(path.geometry.coordinates.map(coord => [coord[0], coord[1]]));
    const _sp = turf.point([spCoords[0], spCoords[1]]);
    const _ep = turf.point([epCoords[0], epCoords[1]]);
    const _snappedEndPoint = turf.nearestPointOnLine(_line, _ep);
    const _lineSlice = turf.lineSlice(_sp, _snappedEndPoint, _line);

    return 1000 * turf.lineDistance(_lineSlice, {units: 'kilometers'});
  }
}
