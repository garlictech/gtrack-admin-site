import { Action } from '@ngrx/store';
import { ILocalizedItem, ITextualDescription } from 'subrepos/provider-client';

export const ADD_NEW_TRANSLATED_DESCRIPTION = '[HikeProgram] Add new translated description';
export const DELETE_TRANSLATED_DESCRIPTION = '[HikeProgram] Delete translated description';

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

export type Actions = AddNewTranslatedDescription | DeleteTranslatedDescription;
