// tslint:disable:no-property-initializers max-classes-per-file
import { Action } from '@ngrx/store';
import { Toast } from '../interfaces';

export enum ActionTypes {
  ShowProgressSpinner = '[UI] Show progress spinner',
  HideProgressSpinner = '[UI] Hide progress spinner',
  DisplayToast = '[UI] display toast'
}

/**
 * The action displays a progress spinner hiding the full screen.
 *
 * @export
 */
export class ShowProgressSpinner implements Action {
  readonly type = ActionTypes.ShowProgressSpinner;
  /**
   * Creates an instance of ShowProgressSpinner.
   * @param [textLabel] A translateable, optional label that appears below the spinner. Use to add some
   * extra info about what is going on.
   */
  constructor(public textLabel?: string) {
    // EMPTY
  }
}

/**
 * Hide the progress spinner displeyed with {@link ShowProgressSpinner}.
 *
 * @export
 */
export class HideProgressSpinner implements Action {
  readonly type = ActionTypes.HideProgressSpinner;
}

/**
 * Display a toast message.
 *
 * @export
 */
export class DisplayToast implements Action {
  readonly type = ActionTypes.DisplayToast;
  /**
   * Creates an instance of DisplayToast.
   * @param notification The toast descriptor.
   */
  constructor(public notification: Toast) {
    // EMPTY
  }
}

export type AllActions = ShowProgressSpinner | HideProgressSpinner | DisplayToast;
