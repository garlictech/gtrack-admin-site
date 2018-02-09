import { EntityAdapter, EntityState } from '@ngrx/entity';
import { ITextualDescriptionItem } from 'app/shared/interfaces';

export interface ITextualDescriptionEntityState extends EntityState<ITextualDescriptionItem> {};

// State
export interface IHikeEditGeneralInfoState {
  textualDescriptions: ITextualDescriptionEntityState
};
