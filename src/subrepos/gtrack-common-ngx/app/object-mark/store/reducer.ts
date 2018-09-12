import { ActionReducer, combineReducers, ActionReducerMap } from '@ngrx/store';
import * as _ from 'lodash';

import {
  objectMarkAdapter,
  objectMarkContextAdapter,
  IObjectMarkState,
  IObjectMarkEntityState,
  IObjectMarkContextState
} from './state';

import { AllObjectMarkActionTypes, ObjectMarkActionTypes } from './actions';

export const objectMarkReducerInitialState = objectMarkAdapter.getInitialState();
export const objectMarkContextReducerInitialState = objectMarkContextAdapter.getInitialState();

const contextReducer: ActionReducer<IObjectMarkContextState> = (
  state: IObjectMarkContextState = objectMarkContextReducerInitialState,
  action: AllObjectMarkActionTypes
): IObjectMarkContextState => {
  switch (action.type) {
    case ObjectMarkActionTypes.LOAD_CONTEXT:
      return objectMarkContextAdapter.upsertOne(
        {
          id: action.context,
          loading: true,
          loaded: false,
          saving: false,
          saved: false
        },
        state
      );

    case ObjectMarkActionTypes.CONTEXT_LOADED:
      return objectMarkContextAdapter.updateOne(
        {
          id: action.context,
          changes: {
            loading: false,
            loaded: true
          }
        },
        state
      );

    case ObjectMarkActionTypes.MARK_OBJECT:
      return objectMarkContextAdapter.updateOne(
        {
          id: action.context,
          changes: {
            saving: true,
            saved: false
          }
        },
        state
      );

    case ObjectMarkActionTypes.OBJECT_MARKED:
      return objectMarkContextAdapter.updateOne(
        {
          id: action.context,
          changes: {
            saving: false,
            saved: true
          }
        },
        state
      );

    default:
      return state;
  }
};

const reducer: ActionReducer<IObjectMarkEntityState> = (
  state: IObjectMarkEntityState = objectMarkReducerInitialState,
  action: AllObjectMarkActionTypes
): IObjectMarkEntityState => {
  switch (action.type) {
    case ObjectMarkActionTypes.CONTEXT_LOADED:
      return objectMarkAdapter.upsertOne(
        {
          id: action.context,
          markedObjects: action.objects
        },
        state
      );

    default:
      return state;
  }
};

const reducerMap: ActionReducerMap<IObjectMarkState> = {
  contexts: contextReducer,
  objectMarks: reducer
};

export const objectMarkReducer = combineReducers(reducerMap);
