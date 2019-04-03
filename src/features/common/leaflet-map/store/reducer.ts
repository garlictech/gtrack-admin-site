// tslint:disable:only-arrow-functions no-small-switch
import { ActionTypes } from './actions';
import { LeafletMapAction } from './index';
import { State } from './state';

export const initialState: State = {
  mapId: '',
  featureId: undefined
};

export function reducer(state = initialState, action: LeafletMapAction): State {
  switch (action.type) {
    case ActionTypes.ResetMap:
      return initialState;

    case ActionTypes.RegisterMap:
      return {
        ...state,
        mapId: action.mapId
      };

    case ActionTypes.AddFeature:
      return {
        ...state,
        featureId: action.payload.id
      };

    default:
      return state;
  }
}
