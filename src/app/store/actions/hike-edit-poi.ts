import { Action } from '@ngrx/store';
import { IWikipediaPoi, IGooglePoi, IOsmPoi } from 'app/shared/interfaces';

export const GET_WIKIPEDIA_POIS = '[HikeEditPoi] Get Wikipedia pois';
export const SET_WIKIPEDIA_POIS = '[HikeEditPoi] Set Wikipedia pois';
export const GET_GOOGLE_POIS = '[HikeEditPoi] Get Google pois';
export const SET_GOOGLE_POIS = '[HikeEditPoi] Set Google pois';
export const GET_OSM_NATURAL_POIS = '[HikeEditPoi] Get OSM natural pois';
export const SET_OSM_NATURAL_POIS = '[HikeEditPoi] Set OSM natural pois';
export const GET_OSM_AMENITY_POIS = '[HikeEditPoi] Get OSM amenity pois';
export const SET_OSM_AMENITY_POIS = '[HikeEditPoi] Set OSM amenity pois';
export const GET_OSM_ROUTE_POIS = '[HikeEditPoi] Get OSM route pois';
export const SET_OSM_ROUTE_POIS = '[HikeEditPoi] Set OSM route pois';
export const SET_POI_IN_HIKE = '[HikeEditPoi] Set poi inHike';
export const TOGGLE_ONROUTE_MARKERS = '[HikeEditPoi] Toggle onroute markers';
export const TOGGLE_OFFROUTE_MARKERS = '[HikeEditPoi] Toggle offroute markers';
export const GENERATE_SUBDOMAIN_POI_MARKERS = '[HikeEditPoi] Generate subdomain poi markers';
export const MARKERS_CONFIG_CHANGED = '[HikeEditPoi] Markers config changed';

export class GetWikipediaPois implements Action {
  readonly type = GET_WIKIPEDIA_POIS;
  constructor(public payload: {
    bounds: any,
    mapId: string
  }) {
    /* EMPTY */
  }
}

export class SetWikipediaPois implements Action {
  readonly type = SET_WIKIPEDIA_POIS;
  constructor(public payload: {
    pois: IWikipediaPoi[]
  }) {
    /* EMPTY */
  }
}

export class GetGooglePois implements Action {
  readonly type = GET_GOOGLE_POIS;
  constructor(public payload: {
    bounds: any,
    mapId: string
  }) {
    /* EMPTY */
  }
}

export class SetGooglePois implements Action {
  readonly type = SET_GOOGLE_POIS;
  constructor(public payload: {
    pois: IGooglePoi[]
  }) {
    /* EMPTY */
  }
}

export class GetOsmNaturalPois implements Action {
  readonly type = GET_OSM_NATURAL_POIS;
  constructor(public payload: {
    bounds: any,
    mapId: string
  }) {
    /* EMPTY */
  }
}

export class SetOsmNaturalPois implements Action {
  readonly type = SET_OSM_NATURAL_POIS;
  constructor(public payload: {
    pois: IOsmPoi[]
  }) {
    /* EMPTY */
  }
}

export class GetOsmAmenityPois implements Action {
  readonly type = GET_OSM_AMENITY_POIS;
  constructor(public payload: {
    bounds: any,
    mapId: string
  }) {
    /* EMPTY */
  }
}

export class SetOsmAmenityPois implements Action {
  readonly type = SET_OSM_AMENITY_POIS;
  constructor(public payload: {
    pois: IOsmPoi[]
  }) {
    /* EMPTY */
  }
}

export class GetOsmRoutePois implements Action {
  readonly type = GET_OSM_ROUTE_POIS;
  constructor(public payload: {
    bounds: any,
    mapId: string
  }) {
    /* EMPTY */
  }
}

export class SetOsmRoutePois implements Action {
  readonly type = SET_OSM_ROUTE_POIS;
  constructor(public payload: {
    pois: IOsmPoi[]
  }) {
    /* EMPTY */
  }
}

export class SetPoiInHike implements Action {
  readonly type = SET_POI_IN_HIKE;
  constructor(public payload: {
    subdomain: string,
    poiIdx: number,
    isInHike: boolean
  }) {
    /* EMPTY */
  }
}

export class ToggleOnrouteMarkers implements Action {
  readonly type = TOGGLE_ONROUTE_MARKERS;
  constructor(public payload: {
    subdomain: string
  }) {
    /* EMPTY */
  }
}

export class ToggleOffrouteMarkers implements Action {
  readonly type = TOGGLE_OFFROUTE_MARKERS;
  constructor(public payload: {
    subdomain: string
  }) {
    /* EMPTY */
  }
}

export class GenerateSubdomainPoiMarkers implements Action {
  readonly type = GENERATE_SUBDOMAIN_POI_MARKERS;
  constructor(public payload: {
    subdomain: string
  }) {
    /* EMPTY */
  }
}

export class MarkersConfigChanged implements Action {
  readonly type = MARKERS_CONFIG_CHANGED;
  constructor(public payload: {
    subdomain: string
  }) {
    /* EMPTY */
  }
}

export type AllHikeEditPoiActions =
  | GetWikipediaPois
  | SetWikipediaPois
  | GetGooglePois
  | SetGooglePois
  | GetOsmNaturalPois
  | SetOsmNaturalPois
  | GetOsmAmenityPois
  | SetOsmAmenityPois
  | GetOsmRoutePois
  | SetOsmRoutePois
  | SetPoiInHike
  | ToggleOnrouteMarkers
  | ToggleOffrouteMarkers
  | GenerateSubdomainPoiMarkers
  | MarkersConfigChanged;
