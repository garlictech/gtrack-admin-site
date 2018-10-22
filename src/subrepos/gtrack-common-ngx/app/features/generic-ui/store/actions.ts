import { Action } from '@ngrx/store';
import { IToast } from '../interfaces';

export enum ActionTypes {
  ShowProgressSpinner = '[UI] Show progress spinner',
  HideProgressSpinner = '[UI] Hide progress spinner',
  DisplayToast = '[UI] display toast'
}

/**
 * The action displays a progress spinner hiding the full screen.
 *
 * @export
 * @class ShowProgressSpinner
 * @implements {Action}
 */
export class ShowProgressSpinner implements Action {
  readonly type = ActionTypes.ShowProgressSpinner;
  /**
   *Creates an instance of ShowProgressSpinner.
   * @param {string} [textLabel] A translateable, optional label that appears below the spinner. Use to add some
   * extra info about what is going on.
   * @memberof ShowProgressSpinner
   */
  constructor(public textLabel?: string) {
    /* EMPTY */
  }
}

/**
 * Hide the progress spinner displeyed with {@link ShowProgressSpinner}.
 *
 * @export
 * @class HideProgressSpinner
 * @implements {Action}
 */
export class HideProgressSpinner implements Action {
  readonly type = ActionTypes.HideProgressSpinner;
}

/**
 * Display a toast message.
 *
 * @export
 * @class DisplayToast
 * @implements {Action}
 */
export class DisplayToast implements Action {
  readonly type = ActionTypes.DisplayToast;
  /**
   *Creates an instance of DisplayToast.
   * @param {IToast} notification The toast descriptor.
   * @memberof DisplayToast
   */
  constructor(public notification: IToast) {
    /* EMPTY */
  }
}

export type AllActions = ShowProgressSpinner | HideProgressSpinner | DisplayToast;
