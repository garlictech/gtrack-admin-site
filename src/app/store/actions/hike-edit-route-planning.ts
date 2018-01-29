import { Action } from '@ngrx/store';

export const SAVE_ROUTE = '[HikeEditRoutePLanning] Save route';

export class SaveRoute implements Action {
  readonly type = SAVE_ROUTE;
  constructor() { /* EMPTY */ }
}

export type AllHikeEditroutePlanningActions =
  | SaveRoute;
