import { ActionTypes } from './actions';
import { IState } from './state';
import * as ApiActions from './actions';

export const initialState: IState = {
  progressSpinnerOn: false
};

export type Action = ApiActions.AllActions;

export function reducer(state = initialState, action: Action): IState {
  switch (action.type) {
    case ActionTypes.ShowProgressSpinner:
      return { ...state, progressSpinnerOn: true, progressSpinnerText: action.textLabel };

    case ActionTypes.HideProgressSpinner:
      return { ...state, progressSpinnerOn: false, progressSpinnerText: undefined };

    default:
      return state;
  }
}
