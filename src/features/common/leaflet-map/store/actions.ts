// tslint:disable:no-property-initializers max-classes-per-file
import { Action } from '@ngrx/store';

export enum ActionTypes {
  ResetMap = '[Leaflet Map] Reset Map',
  RegisterMap = '[Leaflet Map] Register Map',
  AddFeature = '[Leaflet Map] Add Feature'
}

export class RegisterMap implements Action {
  readonly type = ActionTypes.RegisterMap;
  constructor(public mapId: string) {}
}

export class ResetMap implements Action {
  readonly type = ActionTypes.ResetMap;
}

export class AddFeature implements Action {
  readonly type = ActionTypes.AddFeature;
  constructor(public payload: { id: number }) {}
}

export type AllActions = ResetMap | RegisterMap | AddFeature;
