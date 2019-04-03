// tslint:disable:only-arrow-functions no-small-switch
import { createEntityAdapter, EntityAdapter } from '@ngrx/entity';

import { ActionReducer, ActionReducerMap, combineReducers } from '@ngrx/store';
import { ActionTypes } from './actions';
import { MarkerIconsAction } from './index';
import { State, SvgContent, SvgContentEntityState } from './state';

export const svgIconContentAdapter: EntityAdapter<SvgContent> = createEntityAdapter<SvgContent>();
export const svgIconContentInitialState = svgIconContentAdapter.getInitialState();

export const svgMarkerContentAdapter: EntityAdapter<SvgContent> = createEntityAdapter<SvgContent>();
export const svgMarkerContentInitialState = svgMarkerContentAdapter.getInitialState();

export const initialState: State = {
  icons: undefined,
  markers: undefined
};

export function svgIconsReducer(
  state: SvgContentEntityState = svgIconContentInitialState,
  action: MarkerIconsAction
): SvgContentEntityState {
  switch (action.type) {
    case ActionTypes.Reset:
      return { ...svgIconContentInitialState };

    case ActionTypes.AddSvgIconContents: {
      return svgIconContentAdapter.addAll(action.svgContents, state);
    }

    default:
      return state;
  }
}

export function svgMarkerReducer(
  state: SvgContentEntityState = svgMarkerContentInitialState,
  action: MarkerIconsAction
): SvgContentEntityState {
  switch (action.type) {
    case ActionTypes.Reset:
      return { ...svgMarkerContentInitialState };

    case ActionTypes.AddSvgMarkerContents: {
      return svgIconContentAdapter.addAll(action.svgContents, state);
    }

    default:
      return state;
  }
}

const reducerMap: ActionReducerMap<State> = {
  icons: svgIconsReducer,
  markers: svgMarkerReducer
};

const reducer: ActionReducer<State> = combineReducers(reducerMap);

export function markerIconsReducer(state: any, action: any): State {
  return reducer(state, action);
}
