import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { GeoJsonObject } from 'geojson';

@Injectable()
export class HikeEditMapActions {
  static ADD_GEOJSON = '[HikeEditMap] Add GeoJson';
  static GEOJSON_ADDED = '[HikeEditMap] GeoJson added';
  static REMOVE_GEOJSON = '[HikeEditMap] Remove GeoJson';
  static GEOJSON_REMOVED = '[HikeEditMap] GeoJson removed';
  static ERROR = '[HikeEditMap] Error';

  addGeoJson(): Action {
    return {
      type: HikeEditMapActions.ADD_GEOJSON
    };
  }

  geoJsonAdded(geoJson): Action {
    return {
      type: HikeEditMapActions.GEOJSON_ADDED,
      payload: geoJson
    };
  }

  removeGeoJson(): Action {
    return {
      type: HikeEditMapActions.REMOVE_GEOJSON
    };
  }

  geoJsonRemoved(): Action {
    return {
      type: HikeEditMapActions.GEOJSON_REMOVED
    };
  }

  error(msg): Action {
    return {
      type: HikeEditMapActions.ERROR,
      payload: msg
    };
  }
}
