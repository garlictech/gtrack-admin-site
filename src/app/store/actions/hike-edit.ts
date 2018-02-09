import { Action } from '@ngrx/store';

export const COLLECT_HIKE_DATA = '[HikeEdit] Collect hike data';

export class CollectHikeData implements Action {
  readonly type = COLLECT_HIKE_DATA;
  constructor(public payload: {
    hikeId: string
  }) { /* EMPTY */ }
}

export type AllHikeEditActions =
  | CollectHikeData;
