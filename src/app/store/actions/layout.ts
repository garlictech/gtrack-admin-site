import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { IMockHikeElement } from '../../shared/interfaces';

export const OPEN_SIDENAV = '[Layout] Open Sidenav';
export const CLOSE_SIDENAV = '[Layout] Close Sidenav';

export class OpenSidenav implements Action {
  readonly type = OPEN_SIDENAV;
  constructor() {}
}

export class CloseSidenav implements Action {
  readonly type = CLOSE_SIDENAV;
  constructor() {
    /* EMPTY */
  }
}

export type AllLayoutActions =
  | OpenSidenav
  | CloseSidenav;
