import { Action } from '@ngrx/store';
import { ITextualDescriptionItem } from 'app/shared/interfaces';

export const RESET_GENERAL_INFO_STATE = '[HikeEditGeneralInfo] Reset';
export const SET_HIKE_ID = '[HikeEditGeneralInfo] Set hike id';
export const SET_ROUTE_ID = '[HikeEditGeneralInfo] Set route id';
export const SET_GENERAL_INFO = '[HikeEditGeneralInfo] Set general info';
export const SET_IS_ROUND_TRIP = '[HikeEditGeneralInfo] Set isRoundTrip';
export const SET_DIFFICULTY = '[HikeEditGeneralInfo] Set difficulty';
export const SET_POIS = '[HikeEditGeneralInfo] Set pois';
export const SET_DESCRIPTIONS = '[HikeEditGeneralInfo] Set descriptions';

export class ResetGeneralInfoState implements Action {
  readonly type = RESET_GENERAL_INFO_STATE;
  constructor() { /* EMPTY */ }
}

export class SetHikeId implements Action {
  readonly type = SET_HIKE_ID;
  constructor(public payload: {
    hikeId: string
  }) { /* EMPTY */ }
}

export class SetRouteId implements Action {
  readonly type = SET_ROUTE_ID;
  constructor(public payload: {
    routeId: string
  }) { /* EMPTY */ }
}

export class SetGeneralInfo implements Action {
  readonly type = SET_GENERAL_INFO;
  constructor(public payload: {
    isRoundTrip: boolean,
    difficulty: number
  }) { /* EMPTY */ }
}

export class SetPois implements Action {
  readonly type = SET_POIS;
  constructor(public payload: {
    pois: string[]
  }) { /* EMPTY */ }
}

export class SetDescriptions implements Action {
  readonly type = SET_DESCRIPTIONS;

  constructor(public payload: {
    descriptions: ITextualDescriptionItem[]
  }) { /* EMPTY */ }
}

export type AllHikeEditGeneralInfoActions =
  | ResetGeneralInfoState
  | SetHikeId
  | SetRouteId
  | SetGeneralInfo
  | SetPois
  | SetDescriptions;
