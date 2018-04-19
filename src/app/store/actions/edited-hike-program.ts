import { Action } from '@ngrx/store';
import { ILocalizedItem, ITextualDescription } from 'subrepos/provider-client';

export const ADD_NEW_TRANSLATED_HIKE_DESCRIPTION = '[HikeProgram] Add new translated hike description';
export const DELETE_TRANSLATED_HIKE_DESCRIPTION = '[HikeProgram] Delete translated hike description';
export const ADD_HIKE_PROGRAM_DETAILS = '[HikeProgram] Add some details';
export const SAVE_HIKE_PROGRAM = '[HikeProgram] Save hike program';
export const HIKE_PROGRAM_SAVE_SUCCESS = '[HikeProgram] Hike program saved successfully';
export const HIKE_PROGRAM_SAVE_FAILED = '[HikeProgram] Hike program save failure';

export class AddNewTranslatedHikeProgramDescription implements Action {
  readonly type = ADD_NEW_TRANSLATED_HIKE_DESCRIPTION;

  constructor(
    public languageKey: string,
    public content: ITextualDescription
  ) {}
}

export interface IDetails {
  difficulty?: number;
}

export class AddHikeProgramDetails implements Action {
  readonly type = ADD_HIKE_PROGRAM_DETAILS;

  constructor(public details: IDetails) {}
}

export class DeleteTranslatedHikeProgramDescription implements Action {
  readonly type = DELETE_TRANSLATED_HIKE_DESCRIPTION;

  constructor(public languageKey: string) {}
}

export class SaveHikeProgram implements Action {
  readonly type = SAVE_HIKE_PROGRAM;
}

export class HikeProgramSaveSuccess implements Action {
  readonly type = HIKE_PROGRAM_SAVE_SUCCESS;
}

export class HikeProgramSaveFailed implements Action {
  readonly type = HIKE_PROGRAM_SAVE_FAILED;

  constructor(public error: any) {}
}
export type AllEditedHikeProgramActions =
  | AddNewTranslatedHikeProgramDescription
  | AddHikeProgramDetails
  | DeleteTranslatedHikeProgramDescription
  | SaveHikeProgram
  | HikeProgramSaveSuccess
  | HikeProgramSaveFailed;
