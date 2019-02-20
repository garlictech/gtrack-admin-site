import * as ApiActions from './actions';
import { State } from './state';

export const initialState: State = {
  progressSpinnerOn: false
};

export type Action = ApiActions.AllActions;

// tslint:disable-next-line:only-arrow-functions
export function reducer(state = initialState, action: Action): State {
  switch (action.type) {
    case ApiActions.ActionTypes.ShowProgressSpinner:
      return { ...state, progressSpinnerOn: true, progressSpinnerText: action.textLabel };

    case ApiActions.ActionTypes.HideProgressSpinner:
      return { ...state, progressSpinnerOn: false, progressSpinnerText: undefined };

    default:
      return state;
  }
}
