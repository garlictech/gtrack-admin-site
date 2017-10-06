import { Action } from '@ngrx/store';
import { IHikeElement } from '../shared/interfaces';

export const OPEN_SIDENAV = '[Layout] Open Sidenav';
export const CLOSE_SIDENAV = '[Layout] Close Sidenav';

export const SAVE_HIKE = '[Hike] Save hike';
export const DELETE_HIKE = '[Hike] Delete hike';

export class OpenSidenavAction implements Action {
  readonly type = OPEN_SIDENAV;
}

export class CloseSidenavAction implements Action {
  readonly type = CLOSE_SIDENAV;
}

export class SaveHikeAction implements Action {
  readonly type = SAVE_HIKE;

  constructor(public payload: IHikeElement) {
      /* EMPTY */
  }
}

export class DeleteHikeAction implements Action {
  readonly type = DELETE_HIKE;

  constructor(public payload: string) {
      /* EMPTY */
  }
}

export type Actions =
  | OpenSidenavAction
  | CloseSidenavAction
  | SaveHikeAction
  | DeleteHikeAction;
