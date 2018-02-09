import { Action } from '@ngrx/store';
import { ITextualDescriptionItem } from 'app/shared/interfaces';

export const SET_TEXTUAL_DESCRIPTIONS = '[HikeEditGeneralInfo] Set textual descriptions';

export class SetTextualDescriptions implements Action {
  readonly type = SET_TEXTUAL_DESCRIPTIONS;

  constructor(public payload: {
    descriptions: ITextualDescriptionItem[]
  }) { /* EMPTY */ }
}

export type AllHikeEditGeneralInfoActions =
  | SetTextualDescriptions;
