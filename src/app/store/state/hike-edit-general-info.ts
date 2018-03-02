import { EntityAdapter, EntityState } from '@ngrx/entity';
import { ITextualDescriptionItem } from 'app/shared/interfaces';

export interface IGeneralInfoState {
  hikeId: string;
  routeId: string;
  isRoundTrip: boolean;
  difficulty: number;
}

export interface IDescriptionEntityState extends EntityState<ITextualDescriptionItem> {};

// State
export interface IHikeEditGeneralInfoState {
  generalInfo: IGeneralInfoState,
  descriptions: IDescriptionEntityState
};
