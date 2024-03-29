import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

export enum NotificaitonSeverity {
  Success = 'success',
  Info = 'info',
  Warn = 'warn',
  Error = 'error'
}

export interface Notification {
  text: string | null;
  type: string | null;
  severity: NotificaitonSeverity;
}

export enum EToastSeverity {
  Success = 'success',
  Info = 'info',
  Warn = 'warn',
  Error = 'error'
}

/**
 * The toast descriptor.
 *
 * @export
 */
export interface Toast {
  /**
   * Toast severity. Implement a default value! It determines the toast color.
   *
   */
  severity?: EToastSeverity;
  /**
   * Toast summary as translateable label.
   *
   */
  summary: string;
  /**
   * A longer description as translateable label.
   *
   */
  detail?: string;
}

export interface GenericUiPlatformServiceData {
  /**
   * Display an alert, with the translated title label. So, the label is a localizable stuff, it must present
   * in the appropriate language files (en_US.json, whetever).
   *
   * The method must return an observable of true when the user selects OK.
   */
  alert(messageTxt: string, headerTxt?: string): Observable<boolean>;

  /**
   * Display an confirm dialog, with the translated title label. So, the label is a localizable stuff, it must present
   * in the appropriate language files (en_US.json, whetever).
   *
   * The method must return an observable of true when the user selects OK, otherwise observable of false.
   * This latter is for the confirm mode, when resolved if the user clicks on yes, and rejected if
   * clicks on no.
   */
  confirm(titleLabel: string): Observable<boolean>;

  /**
   * Display a loader dialog ("spinner") with backdrop. Emits true when the spinner is displayed.
   * You can give an optional, translated text label that is displayed below the spinner.
   */
  displayLoader(textLabel?: string): Observable<boolean>;

  /** Dismiss the loader dialog ("spinner"),  Emits true when the spinner is removed. */
  dismissLoader(): Observable<boolean>;

  /** Display a toast notification */
  displayToast(toast: Toast): void;
}

export const GENERIC_UI_PLATFORM_SERVICE = new InjectionToken<GenericUiPlatformServiceData>(
  'Generic UI platform service'
);
