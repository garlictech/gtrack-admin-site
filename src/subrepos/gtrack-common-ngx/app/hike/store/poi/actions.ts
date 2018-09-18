import { Action } from '@ngrx/store';
import { IPoi, IPoiStored, EObjectState } from '../../../../../provider-client';

export enum PoiActionTypes {
  LOAD_POI = '[Poi] Load poi',
  POI_LOADED = '[Poi] Poi loaded',
  LOAD_POIS = '[Poi] Load pois',
  ALL_POI_LOADED = '[Poi] All poi loaded',
  SAVE_POI = '[Poi] Save poi',
  POI_SAVED = '[Poi] Poi saved',
  POI_MODIFIED = '[Poi] Poi modified',
  ADD_GTRACK_POIS = '[Poi] Add gTrack pois',
  UPDATE_POI_STATE = '[Poi] Update gTrack poi state',
  DELETE_POI = '[Poi] Delete gTrack poi',
  POI_DELETED = '[Poi] gTrack poi deleted',
  MERGE_POI = '[Poi] Merge gTrack poi',
  POI_MERGED_SUCCESSFULLY = '[Poi] gTrack poi merged successfully',
  POI_MERGE_FAILED = '[Poi] gTrack poi merge failed'
}

export class LoadPoi implements Action {
  readonly type = PoiActionTypes.LOAD_POI;

  constructor(public context: string) {}
}

export class LoadPois implements Action {
  readonly type = PoiActionTypes.LOAD_POIS;

  constructor(public contexts: string[]) {}
}

export class PoiLoaded implements Action {
  readonly type = PoiActionTypes.POI_LOADED;

  constructor(public context: string, public poi: IPoiStored) {}
}

export class AllPoiLoaded implements Action {
  readonly type = PoiActionTypes.ALL_POI_LOADED;

  constructor(public contexts: string[], public pois: IPoiStored[]) {}
}

export class SavePoi implements Action {
  readonly type = PoiActionTypes.SAVE_POI;

  constructor(public poi: IPoi) {}
}

export class PoiSaved implements Action {
  readonly type = PoiActionTypes.POI_SAVED;

  constructor(public context: string) {}
}

export class PoiModified implements Action {
  readonly type = PoiActionTypes.POI_MODIFIED;

  constructor(public context: string) {}
}

export class UpdatePoiState implements Action {
  readonly type = PoiActionTypes.UPDATE_POI_STATE;

  constructor(public id: string, public state: EObjectState) {}
}

export class DeletePoi implements Action {
  readonly type = PoiActionTypes.DELETE_POI;

  constructor(public id: string) {}
}

export class PoiDeleted implements Action {
  readonly type = PoiActionTypes.POI_DELETED;

  constructor(public context: string) {}
}

export class MergePoi implements Action {
  readonly type = PoiActionTypes.MERGE_POI;

  constructor(public ids: string[], public newData: any) {}
}

export class PoiMergedSuccessfully implements Action {
  readonly type = PoiActionTypes.POI_MERGED_SUCCESSFULLY;

  constructor(public newId: string, public mergedIds: string[]) {}
}

export class PoiMergeFailed implements Action {
  readonly type = PoiActionTypes.POI_MERGE_FAILED;

  constructor(public error: any) {}
}

export type AllPoiActions =
  | LoadPoi
  | PoiLoaded
  | LoadPois
  | AllPoiLoaded
  | SavePoi
  | PoiSaved
  | PoiModified
  | UpdatePoiState
  | DeletePoi
  | PoiDeleted
  | MergePoi
  | PoiMergedSuccessfully
  | PoiMergeFailed;
