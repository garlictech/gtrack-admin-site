import { Action, ActionReducer, ActionReducerMap, combineReducers } from '@ngrx/store';
import { createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import { ITextualDescriptionItem } from 'app/shared/interfaces';
import { IDescriptionEntityState, IHikeEditGeneralInfoState } from '../state';
import { hikeEditGeneralInfoActions } from '../index';

export const descriptionAdapter: EntityAdapter<ITextualDescriptionItem> = createEntityAdapter<ITextualDescriptionItem>();
const descriptionReducer: ActionReducer<IDescriptionEntityState> = (
  state: IDescriptionEntityState = descriptionAdapter.getInitialState(),
  action: hikeEditGeneralInfoActions.AllHikeEditGeneralInfoActions
): IDescriptionEntityState => {
  switch (action.type) {
    case hikeEditGeneralInfoActions.SET_DESCRIPTIONS: {
      return descriptionAdapter.addAll(action.payload.descriptions, state);
    }
    default:
      return state;
  }
}

const reducerMap: ActionReducerMap<IHikeEditGeneralInfoState> = {
  descriptions: descriptionReducer
};

export const hikeEditGeneralInfoReducer = combineReducers(reducerMap);
