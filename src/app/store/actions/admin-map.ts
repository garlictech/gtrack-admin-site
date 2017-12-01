import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';

export const REGISTER_MAP = '[AdminMap] Register Map';

export class RegisterMap implements Action {
  readonly type = REGISTER_MAP;
  constructor(public payload: {
    mapId: string
  }) {
    /* EMPTY */
  }
}

export type AllAdminMapActions =
  | RegisterMap;
