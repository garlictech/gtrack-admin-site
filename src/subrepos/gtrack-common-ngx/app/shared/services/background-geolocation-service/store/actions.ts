import { Action } from '@ngrx/store';
import { IGeoPosition } from '../interfaces';

export enum BackgroundGeolocationActionTypes {
  CURRENT_LOCATION_OBTAINED = '[Location] current location obtained',
  START_TRACKING = '[Location] start tracking',
  END_TRACKING = '[Location] end tracking'
}

export class CurrentLocationObtained implements Action {
  readonly type = BackgroundGeolocationActionTypes.CURRENT_LOCATION_OBTAINED;

  constructor(public location: IGeoPosition) {}
}

export class StartTracking {
  readonly type = BackgroundGeolocationActionTypes.START_TRACKING;
}

export class EndTracking {
  readonly type = BackgroundGeolocationActionTypes.END_TRACKING;
}

export type Actions = CurrentLocationObtained | StartTracking | EndTracking;
