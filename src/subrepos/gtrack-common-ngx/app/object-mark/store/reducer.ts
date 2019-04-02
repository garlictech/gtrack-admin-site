// tslint:disable:only-arrow-functions no-small-switch
import { ActionReducer, ActionReducerMap, combineReducers } from '@ngrx/store';
import { AllObjectMarkActionTypes, ObjectMarkActionTypes } from './actions';
import {
  objectMarkAdapter,
  objectMarkContextAdapter,
  ObjectMarkContextState,
  ObjectMarkEntityState,
  ObjectMarkState
} from './state';

export const objectMarkReducerInitialState = objectMarkAdapter.getInitialState();
export const objectMarkContextReducerInitialState = objectMarkContextAdapter.getInitialState();

const contextReducer: ActionReducer<ObjectMarkContextState> = (
  state: ObjectMarkContextState = objectMarkContextReducerInitialState,
  action: AllObjectMarkActionTypes
): ObjectMarkContextState => {
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

const reducer: ActionReducer<ObjectMarkEntityState> = (
  state: ObjectMarkEntityState = objectMarkReducerInitialState,
  action: AllObjectMarkActionTypes
): ObjectMarkEntityState => {
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

const reducerMap: ActionReducerMap<ObjectMarkState> = {
  contexts: contextReducer,
  objectMarks: reducer
};

export const objectMarkReducer = combineReducers(reducerMap);
