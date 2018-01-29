import { Action } from '@ngrx/store';
import { AdminMapMarker } from 'app/shared/services/admin-map';

export const SET_GOOGLE_MARKERS = '[HikeEditMap] Set Google markers';
export const SET_OSM_AMENITY_MARKERS = '[HikeEditMap] Set OSM amenity markers';
export const SET_OSM_NATURAL_MARKERS = '[HikeEditMap] Set OSM natural markers';
export const SET_OSM_ROUTE_MARKERS = '[HikeEditMap] Set OSM route markers';
export const SET_WIKIPEDIA_MARKERS = '[HikeEditMap] Set Wikipedia markers';

export class SetGoogleMarkers implements Action {
  readonly type = SET_GOOGLE_MARKERS;
  constructor(public payload: {
    markers: AdminMapMarker[]
  }) { /* EMPTY */ }
}

export class SetOsmAmenityMarkers implements Action {
  readonly type = SET_OSM_AMENITY_MARKERS;
  constructor(public payload: {
    markers: AdminMapMarker[]
  }) { /* EMPTY */ }
}

export class SetOsmNaturalMarkers implements Action {
  readonly type = SET_OSM_NATURAL_MARKERS;
  constructor(public payload: {
    markers: AdminMapMarker[]
  }) { /* EMPTY */ }
}

export class SetOsmRouteMarkers implements Action {
  readonly type = SET_OSM_ROUTE_MARKERS;
  constructor(public payload: {
    markers: AdminMapMarker[]
  }) { /* EMPTY */ }
}

export class SetWikipediaMarkers implements Action {
  readonly type = SET_WIKIPEDIA_MARKERS;
  constructor(public payload: {
    markers: AdminMapMarker[]
  }) { /* EMPTY */ }
}

export type AllHikeEditMapActions =
  | SetGoogleMarkers
  | SetOsmAmenityMarkers
  | SetOsmNaturalMarkers
  | SetOsmRouteMarkers
  | SetWikipediaMarkers;
