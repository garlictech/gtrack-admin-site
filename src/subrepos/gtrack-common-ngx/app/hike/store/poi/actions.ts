import { Action } from '@ngrx/store';
import { IPoi, IPoiStored } from '../../../../../provider-client';

export enum PoiActionTypes {
  LOAD_POI = '[Poi] Load poi',
  POI_LOADED = '[Poi] Poi loaded',
  LOAD_POIS = '[Poi] Load pois',
  ALL_POI_LOADED = '[Poi] All poi loaded',
  SAVE_POI = '[Poi] Save poi',
  POI_SAVED = '[Poi] Poi saved',
  POI_MODIFIED = '[Poi] Poi modified',
  ADD_GTRACK_POIS = '[Poi] Add gTrack pois'
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

  constructor(public context: string, public poi: IPoiStored) {
    // Empty
  }
}

export class AllPoiLoaded implements Action {
  readonly type = PoiActionTypes.ALL_POI_LOADED;

  constructor(public contexts: string[], public pois: IPoiStored[]) {
    // Empty
  }
}

export class SavePoi implements Action {
  readonly type = PoiActionTypes.SAVE_POI;

  constructor(public poi: IPoi) {
    // Empty
  }
}

export class PoiSaved implements Action {
  readonly type = PoiActionTypes.POI_SAVED

  constructor(public context: string) {
    // Empty
  }
}

export class PoiModified implements Action {
  readonly type = PoiActionTypes.POI_MODIFIED

  constructor(public context: string) {}
}

export type AllPoiActions =
  | LoadPoi
  | PoiLoaded
  | LoadPois
  | AllPoiLoaded
  | SavePoi
  | PoiSaved
  | PoiModified;
