import { Action } from '@ngrx/store';
import { ITextualDescriptionItem } from 'app/shared/interfaces';

export const SET_HIKE_ID = '[HikeEditGeneralInfo] Set hike id';
export const SET_ROUTE_ID = '[HikeEditGeneralInfo] Set route id';
export const SET_DESCRIPTIONS = '[HikeEditGeneralInfo] Set descriptions';

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

export class SetDescriptions implements Action {
  readonly type = SET_DESCRIPTIONS;

  constructor(public payload: {
    descriptions: ITextualDescriptionItem[]
  }) { /* EMPTY */ }
}

export type AllHikeEditGeneralInfoActions =
  | SetHikeId
  | SetRouteId
  | SetDescriptions;
