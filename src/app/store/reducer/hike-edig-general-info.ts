import { Action, ActionReducer, ActionReducerMap, combineReducers } from '@ngrx/store';
import { createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import { ITextualDescriptionItem } from 'app/shared/interfaces';
import { IDescriptionEntityState, IHikeEditGeneralInfoState, IGeneralInfoState } from '../state';
import { hikeEditGeneralInfoActions } from '../index';

/**
 * General info
 */

export const initialGeneralInfoState: IGeneralInfoState = {
  hikeId: '',
  routeId: '',
  isRoundTrip: false,
  difficulty: 5,
  pois: [],
  initialized: false
};

export function generalInfoReducer(
  state = initialGeneralInfoState,
  action: hikeEditGeneralInfoActions.AllHikeEditGeneralInfoActions
): IGeneralInfoState {
  switch (action.type) {
    case hikeEditGeneralInfoActions.RESET_GENERAL_INFO_STATE:
      return initialGeneralInfoState;
    case hikeEditGeneralInfoActions.SET_INITIALIZED:
      return {
        ...state,
        initialized: true
      };
    case hikeEditGeneralInfoActions.SET_HIKE_ID:
      return {
        ...state,
        hikeId: action.payload.hikeId
      };
    case hikeEditGeneralInfoActions.SET_ROUTE_ID:
      return {
        ...state,
        routeId: action.payload.routeId
      };
    case hikeEditGeneralInfoActions.SET_IS_ROUND_TRIP:
      return {
        ...state,
        isRoundTrip: action.payload.isRoundTrip
      }
    case hikeEditGeneralInfoActions.SET_DIFFICULTY:
      return {
        ...state,
        difficulty: action.payload.difficulty
      }
    case hikeEditGeneralInfoActions.SET_POIS:
      return {
        ...state,
        pois: action.payload.pois
      };
    default:
      return state;
  }
}

/**
 * Descriptions
 */

export const descriptionAdapter: EntityAdapter<ITextualDescriptionItem> = createEntityAdapter<ITextualDescriptionItem>();
export const descriptionInitialState = descriptionAdapter.getInitialState();

const descriptionReducer: ActionReducer<IDescriptionEntityState> = (
  state: IDescriptionEntityState = descriptionInitialState,
  action: hikeEditGeneralInfoActions.AllHikeEditGeneralInfoActions
): IDescriptionEntityState => {
  switch (action.type) {
    case hikeEditGeneralInfoActions.SET_DESCRIPTIONS: {
      return descriptionAdapter.addAll(action.payload.descriptions, state);
    }
    case hikeEditGeneralInfoActions.ADD_DESCRIPTION: {
      return descriptionAdapter.addOne(action.payload.description, state);
    }
    default:
      return state;
  }
}

const reducerMap: ActionReducerMap<IHikeEditGeneralInfoState> = {
  generalInfo: generalInfoReducer,
  descriptions: descriptionReducer
};

export const hikeEditGeneralInfoReducer = combineReducers(reducerMap);
