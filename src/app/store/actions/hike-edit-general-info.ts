import { Action } from '@ngrx/store';
import { ITextualDescriptionItem } from 'app/shared/interfaces';

export const SET_DESCRIPTIONS = '[HikeEditGeneralInfo] Set descriptions';

export class SetDescriptions implements Action {
  readonly type = SET_DESCRIPTIONS;

  constructor(public payload: {
    descriptions: ITextualDescriptionItem[]
  }) { /* EMPTY */ }
}

export type AllHikeEditGeneralInfoActions =
  | SetDescriptions;
