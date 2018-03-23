import { Action } from '@ngrx/store';

export enum UserStatusActionTypes {
  REQUEST_LOCATION = '[UserStatus] Request location',
  LOCATION_REQUESTED = '[UserStatus] Location requested',
  REQUEST_LOCATION_FAILED = '[UserStatus] Request location failed'
};

export class RequestLocation implements Action {
  readonly type = UserStatusActionTypes.REQUEST_LOCATION;
}

export class LocationRequested implements Action {
  readonly type = UserStatusActionTypes.LOCATION_REQUESTED;

  constructor(public location: GeoJSON.Position) {}
}

export class RequestLocationFailed {
  readonly type = UserStatusActionTypes.REQUEST_LOCATION_FAILED;

  constructor(public error: Error) {}
}

export type AllUserStatusActions =
  | RequestLocation
  | LocationRequested
  | RequestLocationFailed;
