import { Action } from '@ngrx/store';

export enum ActionTypes {
  ResetMap = '[Leaflet Map] Reset Map',
  RegisterMap = '[Leaflet Map] Register Map'
}

export class RegisterMap implements Action {
  readonly type = ActionTypes.RegisterMap;
  constructor(public mapId: string) {}
}

export class ResetMap implements Action {
  readonly type = ActionTypes.ResetMap;
}

export type AllActions =
  | ResetMap
  | RegisterMap
  ;
