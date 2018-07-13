import { Action } from '@ngrx/store';
import { IWikipediaPoi, IGooglePoi, IOsmPoi, IGTrackPoi } from '../../shared/interfaces';

export const RESET_POI_STATE = '[HikeEditPoi] Reset';

export const GET_GOOGLE_POIS = '[HikeEditPoi] Get Google pois';
export const SET_GOOGLE_POIS = '[HikeEditPoi] Set Google pois';
export const SET_GOOGLE_POIS_IN_GTRACK_DB = '[HikeEditPoi] Set Google pois inGtrackDb';
export const SET_GOOGLE_POIS_IN_COLLECTOR = '[HikeEditPoi] Set Google pois inCollector';
export const SET_GOOGLE_POI_SELECTED = '[HikeEditPoi] Set Google poi selected';

export const GET_OSM_AMENITY_POIS = '[HikeEditPoi] Get OSM amenity pois';
export const SET_OSM_AMENITY_POIS = '[HikeEditPoi] Set OSM amenity pois';
export const SET_OSM_AMENITY_POIS_IN_GTRACK_DB = '[HikeEditPoi] Set OSM amenity pois inGtrackDb';
export const SET_OSM_AMENITY_POIS_IN_COLLECTOR = '[HikeEditPoi] Set OSM amenity pois inCollector';
export const SET_OSM_AMENITY_POI_SELECTED = '[HikeEditPoi] Set OSM amenity poi selected';

export const GET_OSM_NATURAL_POIS = '[HikeEditPoi] Get OSM natural pois';
export const SET_OSM_NATURAL_POIS = '[HikeEditPoi] Set OSM natural pois';
export const SET_OSM_NATURAL_POIS_IN_GTRACK_DB = '[HikeEditPoi] Set OSM natural pois inGtrackDb';
export const SET_OSM_NATURAL_POIS_IN_COLLECTOR = '[HikeEditPoi] Set OSM natural pois inCollector';
export const SET_OSM_NATURAL_POI_SELECTED = '[HikeEditPoi] Set OSM natural poi selected';

export const GET_OSM_ROUTE_POIS = '[HikeEditPoi] Get OSM route pois';
export const SET_OSM_ROUTE_POIS = '[HikeEditPoi] Set OSM route pois';
export const SET_OSM_ROUTE_POIS_IN_GTRACK_DB = '[HikeEditPoi] Set OSM route pois inGtrackDb';
export const SET_OSM_ROUTE_POIS_IN_COLLECTOR = '[HikeEditPoi] Set OSM route pois inCollector';
export const SET_OSM_ROUTE_POI_SELECTED = '[HikeEditPoi] Set OSM route poi selected';

export const GET_WIKIPEDIA_POIS = '[HikeEditPoi] Get Wikipedia pois';
export const SET_WIKIPEDIA_POIS = '[HikeEditPoi] Set Wikipedia pois';
export const SET_WIKIPEDIA_POIS_IN_GTRACK_DB = '[HikeEditPoi] Set Wikipedia pois inGtrackDb';
export const SET_WIKIPEDIA_POIS_IN_COLLECTOR = '[HikeEditPoi] Set Wikipedia pois inCollector';
export const SET_WIKIPEDIA_POI_SELECTED = '[HikeEditPoi] Set Wikipedia poi selected';

export const TOGGLE_ONROUTE_MARKERS = '[HikeEditPoi] Toggle onroute markers';
export const TOGGLE_OFFROUTE_MARKERS = '[HikeEditPoi] Toggle offroute markers';

export const SET_SAVING = '[HikeEditPoi] Set saving';
export const SET_LOADING = '[HikeEditPoi] Set loading';
export const MARKERS_CONFIG_CHANGED = '[HikeEditPoi] Markers config changed';

export const RESET_POI_MERGE_SELECTION = '[HikeEditPoi] Reset poi merge selection';
export const ADD_GTRACK_POI_TO_MERGE_SELECTION = '[HikeEditPoi] Add gTrack poi to merge selection';
export const REMOVE_GTRACK_POI_FROM_MERGE_SELECTION = '[HikeEditPoi] Remove gTrack poi from merge selection';

export const ADD_POIS_TO_COLLECTOR = '[HikeEditPoi] Add pois to collector';
export const REMOVE_POIS_FROM_COLLECTOR = '[HikeEditPoi] Remove pois from collector';
export const SET_COLLECTOR_POI_SELECTED = '[HikeEditPoi] Set collector poi selected';

export class ResetPoiState implements Action {
  readonly type = RESET_POI_STATE;
}

/**
 * Google pois
 */

export class GetGooglePois implements Action {
  readonly type = GET_GOOGLE_POIS;
  constructor(public bounds: any, public mapId: string) {}
}

export class SetGooglePois implements Action {
  readonly type = SET_GOOGLE_POIS;
  constructor(public pois: IGooglePoi[]) {}
}

export class SetGooglePoisInGtrackDb implements Action {
  readonly type = SET_GOOGLE_POIS_IN_GTRACK_DB;
  constructor(public properties: any) {}
}

export class SetGooglePoisInCollector implements Action {
  readonly type = SET_GOOGLE_POIS_IN_COLLECTOR;
  constructor(public properties: any) {}
}

export class SetGooglePoiSelected implements Action {
  readonly type = SET_GOOGLE_POI_SELECTED;
  constructor(public poiId: string, public isSelected: boolean) {}
}

/**
 * OSM natural pois
 */

export class GetOsmAmenityPois implements Action {
  readonly type = GET_OSM_AMENITY_POIS;
  constructor(public bounds: any, public mapId: string) {}
}

export class SetOsmAmenityPois implements Action {
  readonly type = SET_OSM_AMENITY_POIS;
  constructor(public pois: IOsmPoi[]) {}
}

export class SetOsmAmenityPoisInGtrackDb implements Action {
  readonly type = SET_OSM_AMENITY_POIS_IN_GTRACK_DB;
  constructor(public properties: any) {}
}

export class SetOsmAmenityPoisInCollector implements Action {
  readonly type = SET_OSM_AMENITY_POIS_IN_COLLECTOR;
  constructor(public properties: any) {}
}

export class SetOsmAmenityPoiSelected implements Action {
  readonly type = SET_OSM_AMENITY_POI_SELECTED;
  constructor(public poiId: string, public isSelected: boolean) {}
}

/**
 * OSM natural pois
 */

export class GetOsmNaturalPois implements Action {
  readonly type = GET_OSM_NATURAL_POIS;
  constructor(public bounds: any, public mapId: string) {}
}

export class SetOsmNaturalPois implements Action {
  readonly type = SET_OSM_NATURAL_POIS;
  constructor(public pois: IOsmPoi[]) {}
}

export class SetOsmNaturalPoisInGtrackDb implements Action {
  readonly type = SET_OSM_NATURAL_POIS_IN_GTRACK_DB;
  constructor(public properties: any) {}
}

export class SetOsmNaturalPoisInCollector implements Action {
  readonly type = SET_OSM_NATURAL_POIS_IN_COLLECTOR;
  constructor(public properties: any) {}
}

export class SetOsmNaturalPoiSelected implements Action {
  readonly type = SET_OSM_NATURAL_POI_SELECTED;
  constructor(public poiId: string, public isSelected: boolean) {}
}

/**
 * OSM route pois
 */

export class GetOsmRoutePois implements Action {
  readonly type = GET_OSM_ROUTE_POIS;
  constructor(public bounds: any, public mapId: string) {}
}

export class SetOsmRoutePois implements Action {
  readonly type = SET_OSM_ROUTE_POIS;
  constructor(public pois: IOsmPoi[]) {}
}

export class SetOsmRoutePoisInGtrackDb implements Action {
  readonly type = SET_OSM_ROUTE_POIS_IN_GTRACK_DB;
  constructor(public properties: any) {}
}

export class SetOsmRoutePoisInCollector implements Action {
  readonly type = SET_OSM_ROUTE_POIS_IN_COLLECTOR;
  constructor(public properties: any) {}
}

export class SetOsmRoutePoiSelected implements Action {
  readonly type = SET_OSM_ROUTE_POI_SELECTED;
  constructor(public poiId: string, public isSelected: boolean) {}
}

/**
 * Wikipedia pois
 */

export class GetWikipediaPois implements Action {
  readonly type = GET_WIKIPEDIA_POIS;
  constructor(public bounds: any, public mapId: string) {}
}

export class SetWikipediaPois implements Action {
  readonly type = SET_WIKIPEDIA_POIS;
  constructor(public pois: IWikipediaPoi[]) {}
}

export class SetWikipediaPoisInGtrackDb implements Action {
  readonly type = SET_WIKIPEDIA_POIS_IN_GTRACK_DB;
  constructor(public properties: any) {}
}

export class SetWikipediaPoisInCollector implements Action {
  readonly type = SET_WIKIPEDIA_POIS_IN_COLLECTOR;
  constructor(public properties: any) {}
}

export class SetWikipediaPoiSelected implements Action {
  readonly type = SET_WIKIPEDIA_POI_SELECTED;
  constructor(public poiId: string, public isSelected: boolean) {}
}

/**
 * Poi collector
 */

export class AddPoisToCollector implements Action {
  readonly type = ADD_POIS_TO_COLLECTOR;
  constructor(public pois: any[]) {}
}

export class RemovePoisFromCollector implements Action {
  readonly type = REMOVE_POIS_FROM_COLLECTOR;
  constructor(public poiIds: string[]) {}
}

export class SetCollectorPoiSelected implements Action {
  readonly type = SET_COLLECTOR_POI_SELECTED;
  constructor(public poiId: string, public isSelected: boolean) {}
}

/**
 * Toggle markers
 */

export class ToggleOnrouteMarkers implements Action {
  readonly type = TOGGLE_ONROUTE_MARKERS;
  constructor(public subdomain: string) {}
}

export class ToggleOffrouteMarkers implements Action {
  readonly type = TOGGLE_OFFROUTE_MARKERS;
  constructor(public subdomain: string) {}
}

export class SetSaving implements Action {
  readonly type = SET_SAVING;
  constructor(public subdomain: string, public saving: boolean) {}
}

export class SetLoading implements Action {
  readonly type = SET_LOADING;
  constructor(public subdomain: string) {}
}

export class MarkersConfigChanged implements Action {
  readonly type = MARKERS_CONFIG_CHANGED;
}

/**
 * Merge selection
 */

export class ResetPoiMergeSelection implements Action {
  readonly type = RESET_POI_MERGE_SELECTION;
}

export class AddGTrackPoiToMergeSelection implements Action {
  readonly type = ADD_GTRACK_POI_TO_MERGE_SELECTION;
  constructor(public poiId: string) {}
}

export class RemoveGTrackPoiFromMergeSelection implements Action {
  readonly type = REMOVE_GTRACK_POI_FROM_MERGE_SELECTION;
  constructor(public poiId: string) {}
}

export type AllHikeEditPoiActions =
  | ResetPoiState
  // Google
  | GetGooglePois
  | SetGooglePois
  | SetGooglePoisInGtrackDb
  | SetGooglePoisInCollector
  | SetGooglePoiSelected
  // Osm Amenity
  | GetOsmAmenityPois
  | SetOsmAmenityPois
  | SetOsmAmenityPoisInGtrackDb
  | SetOsmAmenityPoisInCollector
  | SetOsmAmenityPoiSelected
  // Osm Natural
  | GetOsmNaturalPois
  | SetOsmNaturalPois
  | SetOsmNaturalPoisInGtrackDb
  | SetOsmNaturalPoisInCollector
  | SetOsmNaturalPoiSelected
  // Osm Route
  | GetOsmRoutePois
  | SetOsmRoutePois
  | SetOsmRoutePoisInGtrackDb
  | SetOsmRoutePoisInCollector
  | SetOsmRoutePoiSelected
  // Wikipedia
  | GetWikipediaPois
  | SetWikipediaPois
  | SetWikipediaPoisInGtrackDb
  | SetWikipediaPoisInCollector
  | SetWikipediaPoiSelected
  // Collector
  | AddPoisToCollector
  | RemovePoisFromCollector
  | SetCollectorPoiSelected
  // Markers
  | ToggleOnrouteMarkers
  | ToggleOffrouteMarkers
  | SetSaving
  | SetLoading
  | MarkersConfigChanged
  // Merge
  | ResetPoiMergeSelection
  | AddGTrackPoiToMergeSelection
  | RemoveGTrackPoiFromMergeSelection;
