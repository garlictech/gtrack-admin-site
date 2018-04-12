import { Action, ActionReducer, ActionReducerMap, combineReducers } from '@ngrx/store';
import * as _ from 'lodash';

import { IHikeProgram } from 'subrepos/provider-client';

import * as HikeProgramActions from '../actions/hike-program';

export const initialState: IHikeProgram = {
  distance: 0,
  isRoundTrip: false,
  uphill: 0,
  downhill: 0,
  time: 0,
  score: 0,
  location: '',
  difficulty: 1,
  backgroundImageUrls: [],
  routeId: '',
  description: {
    en_US: {
      title: 'a new hike'
    }
  },
  pois: [],
  stops: []
};

export function hikeProgramReducer(state = initialState, action: HikeProgramActions.Actions): IHikeProgram {
  let newState = _.cloneDeep(state);
  switch (action.type) {
    case HikeProgramActions.ADD_NEW_TRANSLATED_DESCRIPTION: {
      newState.description[action.languageKey] = action.content;
      return newState;
    }

    case HikeProgramActions.DELETE_TRANSLATED_DESCRIPTION: {
      newState.description = _.omit(newState.description, action.languageKey);
      return newState;
    }

    default:
      return state;
  }
}
