import { Action } from '@ngrx/store';
import { ITextualDescriptionItem } from 'app/shared/interfaces';

export const RESET_GENERAL_INFO_STATE = '[HikeEditGeneralInfo] Reset';
export const SET_INITIALIZED = '[HikeEditGeneralInfo] Set initialized';
export const SET_HIKE_ID = '[HikeEditGeneralInfo] Set hike id';
export const SET_ROUTE_ID = '[HikeEditGeneralInfo] Set route id';
export const SET_IS_ROUND_TRIP = '[HikeEditGeneralInfo] Set isRoundTrip';
export const SET_DIFFICULTY = '[HikeEditGeneralInfo] Set difficulty';
export const SET_POIS = '[HikeEditGeneralInfo] Set pois';
export const ADD_POI = '[HikeEditGeneralInfo] Add poi';
export const REMOVE_POI = '[HikeEditGeneralInfo] Remove poi';
export const SET_DESCRIPTIONS = '[HikeEditGeneralInfo] Set descriptions';
export const ADD_DESCRIPTION = '[HikeEditGeneralInfo] Add description';

export class ResetGeneralInfoState implements Action {
  readonly type = RESET_GENERAL_INFO_STATE;
  constructor() {}
}

export class SetInitialized implements Action {
  readonly type = SET_INITIALIZED;
  constructor() {}
}

export class SetHikeId implements Action {
  readonly type = SET_HIKE_ID;
  constructor(public payload: {
    hikeId: string
  }) {}
}

export class SetRouteId implements Action {
  readonly type = SET_ROUTE_ID;
  constructor(public payload: {
    routeId: string
  }) {}
}

export class SetIsRoundTrip implements Action {
  readonly type = SET_IS_ROUND_TRIP;
  constructor(public payload: {
    isRoundTrip: boolean
  }) {}
}

export class SetDifficulty implements Action {
  readonly type = SET_DIFFICULTY;
  constructor(public payload: {
    difficulty: number
  }) {}
}

export class SetPois implements Action {
  readonly type = SET_POIS;
  constructor(public payload: {
    pois: string[]
  }) {}
}

export class AddPoi implements Action {
  readonly type = ADD_POI;
  constructor(public payload: {
    poi: string
  }) {}
}

export class RemovePoi implements Action {
  readonly type = REMOVE_POI;
  constructor(public payload: {
    poi: string
  }) {}
}

export class SetDescriptions implements Action {
  readonly type = SET_DESCRIPTIONS;

  constructor(public payload: {
    descriptions: ITextualDescriptionItem[]
  }) {}
}

export class AddDescription implements Action {
  readonly type = ADD_DESCRIPTION;

  constructor(public payload: {
    description: ITextualDescriptionItem
  }) {}
}

export type AllHikeEditGeneralInfoActions =
  | ResetGeneralInfoState
  | SetInitialized
  | SetHikeId
  | SetRouteId
  | SetIsRoundTrip
  | SetDifficulty
  | SetPois
  | AddPoi
  | RemovePoi
  | SetDescriptions
  | AddDescription;
