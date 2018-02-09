import { Action, ActionReducer, ActionReducerMap, combineReducers } from '@ngrx/store';
import { createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import { ITextualDescriptionItem } from 'app/shared/interfaces';
import { ITextualDescriptionEntityState, IHikeEditGeneralInfoState } from '../state';
import { hikeEditGeneralInfoActions } from '../index';

export const textualDescriptionAdapter: EntityAdapter<ITextualDescriptionItem> = createEntityAdapter<ITextualDescriptionItem>();
const textualDescriptionReducer: ActionReducer<ITextualDescriptionEntityState> = (
  state: ITextualDescriptionEntityState = textualDescriptionAdapter.getInitialState(),
  action: hikeEditGeneralInfoActions.AllHikeEditGeneralInfoActions
): ITextualDescriptionEntityState => {
  switch (action.type) {
    case hikeEditGeneralInfoActions.SET_TEXTUAL_DESCRIPTIONS: {
      return textualDescriptionAdapter.addAll(action.payload.descriptions, state);
    }
    case hikeEditGeneralInfoActions.CREATE_TEXTUAL_DESCRIPTION: {
      return textualDescriptionAdapter.addOne(action.payload.description, state);
    }
    /*
    case hikeEditPoiActions.SET_GOOGLE_POI_IN_HIKE:
      return googlePoiAdapter.updateOne({
        id: action.payload.poiId,
        changes: {
          inHike: action.payload.isInHike
        }
      }, state);
    */
    default:
      return state;
  }
}

const reducerMap: ActionReducerMap<IHikeEditGeneralInfoState> = {
  textualDescriptions: textualDescriptionReducer
};

export const hikeEditGeneralInfoReducer = combineReducers(reducerMap);
