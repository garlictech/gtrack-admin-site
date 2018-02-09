import { EntityAdapter, EntityState } from '@ngrx/entity';
import { ITextualDescriptionItem } from 'app/shared/interfaces';

export interface IDescriptionEntityState extends EntityState<ITextualDescriptionItem> {};

// State
export interface IHikeEditGeneralInfoState {
  descriptions: IDescriptionEntityState
};
