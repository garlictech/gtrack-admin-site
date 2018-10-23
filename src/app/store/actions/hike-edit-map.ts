import { Action } from '@ngrx/store';

export const RESET_MAP_STATE = '[HikeEditMap] Reset';

export class ResetMapState implements Action {
  readonly type = RESET_MAP_STATE;
}

export type AllHikeEditMapActions = ResetMapState;
