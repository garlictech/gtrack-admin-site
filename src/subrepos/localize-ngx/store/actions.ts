import { Action } from '@ngrx/store';

export enum MessageActionTypes {
  LANGUAGE_CHANGED = '[Localize] Language changed'
}

export class LanguageChanged implements Action {
  readonly type = MessageActionTypes.LANGUAGE_CHANGED;

  constructor(public language: string) {
    /* EMPTY */
  }
}

export type AllActions = LanguageChanged;
