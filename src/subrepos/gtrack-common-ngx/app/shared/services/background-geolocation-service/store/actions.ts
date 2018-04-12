import { Action } from '@ngrx/store';
import { IGeoPosition } from '../interfaces';

export const CURRENT_LOCATION_OBTAINED = '[Location] current location obtained';

export class CurrentLocationObtained implements Action {
  readonly type = CURRENT_LOCATION_OBTAINED;

  constructor(public location: IGeoPosition) {
    /* EMPTY */
  }
}

export type Actions = CurrentLocationObtained;
