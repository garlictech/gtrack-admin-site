import { Action } from '@ngrx/store';
import { ILocalizedItem, ITextualDescription, IPoiStored } from 'subrepos/provider-client';

export const ADD_NEW_TRANSLATED_DESCRIPTION = '[Gtrack Poi Edit] Add new translated description';
export const DELETE_TRANSLATED_DESCRIPTION = '[Gtrack Poi Edit] Delete translated description';
export const LOAD_POI = '[Gtrack Poi Edit] Load poi to the editor space';
export const SAVE = '[Gtrack Poi Edit] Save hike program';
export const SAVE_SUCCESS = '[Gtrack Poi Edit] Saved successfully';
export const SAVE_FAILED = '[Gtrack Poi Edit] Save failure';

export class AddNewTranslatedDescription implements Action {
  readonly type = ADD_NEW_TRANSLATED_DESCRIPTION;
  constructor(public languageKey: string, public content: ITextualDescription) {
    /* EMPTY */
  }
}

export class DeleteTranslatedDescription implements Action {
  readonly type = DELETE_TRANSLATED_DESCRIPTION;
  constructor(public languageKey: string) {
    /* EMPTY */
  }
}

export class Save implements Action {
  readonly type = SAVE;
}

export class SaveSuccess implements Action {
  readonly type = SAVE_SUCCESS;
}

export class SaveFailed implements Action {
  readonly type = SAVE_FAILED;

  constructor(public error: any) {
    /* EMPTY */
  }
}

export class LoadPoi implements Action {
  readonly type = LOAD_POI;

  constructor(public data: IPoiStored) {
    /* EMPTY */
  }
}
export type Actions =
  | AddNewTranslatedDescription
  | DeleteTranslatedDescription
  | SaveFailed
  | SaveSuccess
  | Save
  | LoadPoi;
