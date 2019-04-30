// tslint:disable:no-property-initializers max-classes-per-file
import { Action } from '@ngrx/store';
import { PopupData } from './state';

export const SHOW_POPUP = '[Popup] Show popup';

export class ShowPopup implements Action {
  readonly type = SHOW_POPUP;
  constructor(public payload: PopupData) {}
}

export type AllActions = ShowPopup;
