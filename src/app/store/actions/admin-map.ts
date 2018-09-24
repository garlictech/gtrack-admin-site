import { Action } from '@ngrx/store';

export const REGISTER_MAP = '[AdminMap] Register Map';
export const RESET_MAP = '[AdminMap] Reset Map';

export class RegisterMap implements Action {
  readonly type = REGISTER_MAP;
  constructor(public mapId: string) {}
}

export class ResetMap implements Action {
  readonly type = RESET_MAP;
}

export type AllAdminMapActions =
  | RegisterMap
  | ResetMap;
