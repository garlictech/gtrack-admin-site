import { Action } from '@ngrx/store';
import { ITextualDescriptionItem } from 'app/shared/interfaces';

export const SET_TEXTUAL_DESCRIPTIONS = '[HikeEditGeneralInfo] Set textual descriptions';
export const CREATE_TEXTUAL_DESCRIPTION = '[HikeEditGeneralInfo] Create textual description';

export class SetTextualDescriptions implements Action {
  readonly type = SET_TEXTUAL_DESCRIPTIONS;

  constructor(public payload: {
    descriptions: ITextualDescriptionItem[]
  }) { /* EMPTY */ }
}

export class CreateTextualDescription implements Action {
  readonly type = CREATE_TEXTUAL_DESCRIPTION;

  constructor(public payload: {
    description: ITextualDescriptionItem
  }) { /* EMPTY */ }
}

export type AllHikeEditGeneralInfoActions =
  | SetTextualDescriptions
  | CreateTextualDescription;
