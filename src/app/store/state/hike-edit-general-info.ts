import { EntityAdapter, EntityState } from '@ngrx/entity';
import { ITextualDescriptionItem } from 'app/shared/interfaces';

export interface IGeneralInfoState {
  hikeId: string;
  routeId: string;
}

export interface IDescriptionEntityState extends EntityState<ITextualDescriptionItem> {};

// State
export interface IHikeEditGeneralInfoState {
  generalInfo: IGeneralInfoState,
  descriptions: IDescriptionEntityState
};
