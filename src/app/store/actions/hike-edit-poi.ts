import { Action } from '@ngrx/store';
import { IWikipediaPoi, IGooglePoi, IOsmPoi, IGTrackPoi } from 'app/shared/interfaces';

export const RESET_POI_STATE = '[HikeEditPoi] Reset';

export const GET_GOOGLE_POIS = '[HikeEditPoi] Get Google pois';
export const SET_GOOGLE_POIS = '[HikeEditPoi] Set Google pois';
export const PATCH_GOOGLE_POIS = '[HikeEditPoi] Patch Google pois';
export const SET_GOOGLE_POI_IN_HIKE = '[HikeEditPoi] Set Google poi inHike';

export const GET_OSM_AMENITY_POIS = '[HikeEditPoi] Get OSM amenity pois';
export const SET_OSM_AMENITY_POIS = '[HikeEditPoi] Set OSM amenity pois';
export const PATCH_OSM_AMENITY_POIS = '[HikeEditPoi] Patch OSM amenity pois';
export const SET_OSM_AMENITY_POI_IN_HIKE = '[HikeEditPoi] Set OSM amenity poi inHike';

export const GET_OSM_NATURAL_POIS = '[HikeEditPoi] Get OSM natural pois';
export const SET_OSM_NATURAL_POIS = '[HikeEditPoi] Set OSM natural pois';
export const PATCH_OSM_NATURAL_POIS = '[HikeEditPoi] Patch OSM natural pois';
export const SET_OSM_NATURAL_POI_IN_HIKE = '[HikeEditPoi] Set OSM natural poi inHike';

export const GET_OSM_ROUTE_POIS = '[HikeEditPoi] Get OSM route pois';
export const SET_OSM_ROUTE_POIS = '[HikeEditPoi] Set OSM route pois';
export const PATCH_OSM_ROUTE_POIS = '[HikeEditPoi] Patch OSM route pois';
export const SET_OSM_ROUTE_POI_IN_HIKE = '[HikeEditPoi] Set OSM route poi inHike';

export const GET_WIKIPEDIA_POIS = '[HikeEditPoi] Get Wikipedia pois';
export const SET_WIKIPEDIA_POIS = '[HikeEditPoi] Set Wikipedia pois';
export const PATCH_WIKIPEDIA_POIS = '[HikeEditPoi] Patch Wikipedia pois';
export const SET_WIKIPEDIA_POI_IN_HIKE = '[HikeEditPoi] Set Wikipedia poi inHike';

export const TOGGLE_ONROUTE_MARKERS = '[HikeEditPoi] Toggle onroute markers';
export const TOGGLE_OFFROUTE_MARKERS = '[HikeEditPoi] Toggle offroute markers';
export const GENERATE_SUBDOMAIN_POI_MARKERS = '[HikeEditPoi] Generate subdomain poi markers';
export const MARKERS_CONFIG_CHANGED = '[HikeEditPoi] Markers config changed';

export class ResetPoiState implements Action {
  readonly type = RESET_POI_STATE;
  constructor() { /* EMPTY */ }
}

/**
 * Google pois
 */

export class GetGooglePois implements Action {
  readonly type = GET_GOOGLE_POIS;
  constructor(public payload: {
    bounds: any,
    mapId: string
  }) { /* EMPTY */ }
}

export class SetGooglePois implements Action {
  readonly type = SET_GOOGLE_POIS;
  constructor(public payload: {
    pois: IGooglePoi[]
  }) { /* EMPTY */ }
}

export class PatchGooglePois implements Action {
  readonly type = PATCH_GOOGLE_POIS;
  constructor(public payload: {
    properties: any
  }) { /* EMPTY */ }
}

export class SetGooglePoiInHike implements Action {
  readonly type = SET_GOOGLE_POI_IN_HIKE;
  constructor(public payload: {
    poiId: string,
    isInHike: boolean
  }) { /* EMPTY */ }
}

/**
 * OSM natural pois
 */

export class GetOsmAmenityPois implements Action {
  readonly type = GET_OSM_AMENITY_POIS;
  constructor(public payload: {
    bounds: any,
    mapId: string
  }) { /* EMPTY */ }
}

export class SetOsmAmenityPois implements Action {
  readonly type = SET_OSM_AMENITY_POIS;
  constructor(public payload: {
    pois: IOsmPoi[]
  }) { /* EMPTY */ }
}

export class PatchOsmAmenityPois implements Action {
  readonly type = PATCH_OSM_AMENITY_POIS;
  constructor(public payload: {
    properties: any
  }) { /* EMPTY */ }
}

export class SetOsmAmenityPoiInHike implements Action {
  readonly type = SET_OSM_AMENITY_POI_IN_HIKE;
  constructor(public payload: {
    poiId: string,
    isInHike: boolean
  }) { /* EMPTY */ }
}

/**
 * OSM natural pois
 */

export class GetOsmNaturalPois implements Action {
  readonly type = GET_OSM_NATURAL_POIS;
  constructor(public payload: {
    bounds: any,
    mapId: string
  }) { /* EMPTY */ }
}

export class SetOsmNaturalPois implements Action {
  readonly type = SET_OSM_NATURAL_POIS;
  constructor(public payload: {
    pois: IOsmPoi[]
  }) { /* EMPTY */ }
}

export class PatchOsmNaturalPois implements Action {
  readonly type = PATCH_OSM_NATURAL_POIS;
  constructor(public payload: {
    properties: any
  }) { /* EMPTY */ }
}

export class SetOsmNaturalPoiInHike implements Action {
  readonly type = SET_OSM_NATURAL_POI_IN_HIKE;
  constructor(public payload: {
    poiId: string,
    isInHike: boolean
  }) {
    /* EMPTY */
  }
}

/**
 * OSM route pois
 */

export class GetOsmRoutePois implements Action {
  readonly type = GET_OSM_ROUTE_POIS;
  constructor(public payload: {
    bounds: any,
    mapId: string
  }) { /* EMPTY */ }
}

export class SetOsmRoutePois implements Action {
  readonly type = SET_OSM_ROUTE_POIS;
  constructor(public payload: {
    pois: IOsmPoi[]
  }) { /* EMPTY */ }
}

export class PatchOsmRoutePois implements Action {
  readonly type = PATCH_OSM_ROUTE_POIS;
  constructor(public payload: {
    properties: any
  }) { /* EMPTY */ }
}

export class SetOsmRoutePoiInHike implements Action {
  readonly type = SET_OSM_ROUTE_POI_IN_HIKE;
  constructor(public payload: {
    poiId: string,
    isInHike: boolean
  }) { /* EMPTY */ }
}

/**
 * Wikipedia pois
 */

export class GetWikipediaPois implements Action {
  readonly type = GET_WIKIPEDIA_POIS;
  constructor(public payload: {
    bounds: any,
    mapId: string
  }) { /* EMPTY */ }
}

export class SetWikipediaPois implements Action {
  readonly type = SET_WIKIPEDIA_POIS;
  constructor(public payload: {
    pois: IWikipediaPoi[]
  }) { /* EMPTY */ }
}

export class PatchWikipediaPois implements Action {
  readonly type = PATCH_WIKIPEDIA_POIS;
  constructor(public payload: {
    properties: any
  }) { /* EMPTY */ }
}

export class SetWikipediaPoiInHike implements Action {
  readonly type = SET_WIKIPEDIA_POI_IN_HIKE;
  constructor(public payload: {
    poiId: string,
    isInHike: boolean
  }) { /* EMPTY */ }
}

/**
 * Toggle markers
 */

export class ToggleOnrouteMarkers implements Action {
  readonly type = TOGGLE_ONROUTE_MARKERS;
  constructor(public payload: {
    subdomain: string
  }) { /* EMPTY */ }
}

export class ToggleOffrouteMarkers implements Action {
  readonly type = TOGGLE_OFFROUTE_MARKERS;
  constructor(public payload: {
    subdomain: string
  }) { /* EMPTY */ }
}

export class GenerateSubdomainPoiMarkers implements Action {
  readonly type = GENERATE_SUBDOMAIN_POI_MARKERS;
  constructor(public payload: {
    subdomain: string
  }) { /* EMPTY */ }
}

export class MarkersConfigChanged implements Action {
  readonly type = MARKERS_CONFIG_CHANGED;
  constructor(public payload: {
    subdomain: string
  }) { /* EMPTY */ }
}

export type AllHikeEditPoiActions =
  | ResetPoiState
  // Google
  | GetGooglePois
  | SetGooglePois
  | PatchGooglePois
  | SetGooglePoiInHike
  // Osm Amenity
  | GetOsmAmenityPois
  | SetOsmAmenityPois
  | PatchOsmAmenityPois
  | SetOsmAmenityPoiInHike
  // Osm Natural
  | GetOsmNaturalPois
  | SetOsmNaturalPois
  | PatchOsmNaturalPois
  | SetOsmNaturalPoiInHike
  // Osm Route
  | GetOsmRoutePois
  | SetOsmRoutePois
  | PatchOsmRoutePois
  | SetOsmRoutePoiInHike
  // Wikipedia
  | GetWikipediaPois
  | SetWikipediaPois
  | PatchWikipediaPois
  | SetWikipediaPoiInHike
  // Markers
  | ToggleOnrouteMarkers
  | ToggleOffrouteMarkers
  | GenerateSubdomainPoiMarkers
  | MarkersConfigChanged;
