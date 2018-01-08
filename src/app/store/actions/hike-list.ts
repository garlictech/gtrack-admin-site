import { Action } from '@ngrx/store';

export const DELETE_HIKE = '[HikeList] Delete hike';

export class DeleteHike implements Action {
  readonly type = DELETE_HIKE;
  constructor(public payload: {
    hikeId: string
  }) {
    /* EMPTY */
  }
}

export type AllHikeListActions =
  | DeleteHike;
