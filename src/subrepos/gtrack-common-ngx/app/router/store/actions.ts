import { Action } from '@ngrx/store';
import { NavigationExtras } from '@angular/router';

export const GO = '[Router] Go';
export const REPLACE = '[Router] Replace';
export const BACK = '[Router] Back';
export const FORWARD = '[Router] Forward';

export class Go implements Action {
  readonly type = GO;

  constructor(public path: any[], public extras?: NavigationExtras) {
    /* EMPTY */
  }
}

export class Replace implements Action {
  readonly type = REPLACE;

  constructor(public path: any[], public extras: NavigationExtras = {}) {
    this.extras.replaceUrl = true;
  }
}

export class Back implements Action {
  readonly type = BACK;
}

export class Forward implements Action {
  readonly type = FORWARD;
}

export type AllActions = Go | Back | Forward;
