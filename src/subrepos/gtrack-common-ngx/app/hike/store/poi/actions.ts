import { Action } from '@ngrx/store';
import { IPoi, Poi } from '../../services/poi';

export enum PoiActionTypes {
  LOAD_POI = '[Poi] Load poi',
  POI_LOADED = '[Poi] Poi loaded',
  LOAD_POIS = '[Poi] Load pois',
  ALL_POI_LOADED = '[Poi] All poi loaded'
}

export class LoadPoi implements Action {
  readonly type = PoiActionTypes.LOAD_POI;

  constructor(public context: string) {
    // Empty
  }
}

export class LoadPois implements Action {
  readonly type = PoiActionTypes.LOAD_POIS;

  constructor(public contexts: string[]) {
    // Empty
  }
}

export class PoiLoaded implements Action {
  readonly type = PoiActionTypes.POI_LOADED;

  constructor(public context: string, public poi: Poi) {
    // Empty
  }
}

export class AllPoiLoaded implements Action {
  readonly type = PoiActionTypes.ALL_POI_LOADED;

  constructor(public contexts: string[], public pois: Poi[]) {
    // Empty
  }
}

export type AllPoiActions =
  | LoadPoi
  | PoiLoaded
  | LoadPois
  | AllPoiLoaded;