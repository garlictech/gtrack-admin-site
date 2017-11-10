import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { GeoJsonObject } from 'geojson';

@Injectable()
export class HikeEditMapActions {
  static TOGGLE_CURRENT_POSITION_MARKER = '[HikeEditMap] Toggle current position marker';
  static RESET_MAP = '[HikeEditMap] Reset map';
  static MAP_RESETED = '[HikeEditMap] Map reseted';
  static ADD_GEOJSON = '[HikeEditMap] Add GeoJson';
  static GEOJSON_ADDED = '[HikeEditMap] GeoJson added';
  static REMOVE_GEOJSON = '[HikeEditMap] Remove GeoJson';
  static GEOJSON_REMOVED = '[HikeEditMap] GeoJson removed';
  static SET_MODE = '[HikeEditMap] Set mode';

  toggleCurrentPositionMarker(): Action {
    return {
      type: HikeEditMapActions.TOGGLE_CURRENT_POSITION_MARKER
    };
  }

  resetMap(): Action {
    return {
      type: HikeEditMapActions.RESET_MAP
    };
  }

  mapReseted(): Action {
    return {
      type: HikeEditMapActions.MAP_RESETED
    };
  }

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

  removeGeoJson(geoJson): Action {
    return {
      type: HikeEditMapActions.REMOVE_GEOJSON,
      payload: geoJson
    };
  }

  geoJsonRemoved(): Action {
    return {
      type: HikeEditMapActions.GEOJSON_REMOVED
    };
  }

  setMode(mode: string): Action {
    return {
      type: HikeEditMapActions.SET_MODE,
      payload: mode
    };
  }
}
