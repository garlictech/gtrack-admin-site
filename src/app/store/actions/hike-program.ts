import { Action } from '@ngrx/store';
import { ILocalizedItem, ITextualDescription } from 'subrepos/provider-client';

export const ADD_NEW_TRANSLATED_DESCRIPTION = '[HikeProgram] Add new translated description';
export const DELETE_TRANSLATED_DESCRIPTION = '[HikeProgram] Delete translated description';
export const SAVE = '[HikeProgram] Save hike program';
export const SAVE_SUCCESS = '[HikeProgram] Saved successfully';
export const SAVE_FAILED = '[HikeProgram] Save failure';

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
export type Actions = AddNewTranslatedDescription | DeleteTranslatedDescription | SaveFailed | SaveSuccess | Save;
