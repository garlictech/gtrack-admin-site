// tslint:disable:only-arrow-functions no-small-switch
import { ActionReducer } from '@ngrx/store';

import _cloneDeep from 'lodash-es/cloneDeep';

import * as Actions from './actions';
import { initialPopupState, PopupState } from './state';

const reducer: ActionReducer<PopupState> = (state = initialPopupState, action: Actions.AllActions) => {
  const result = _cloneDeep(state);

  switch (action.type) {
    case Actions.SHOW_POPUP:
      result.popup = action.payload;

      return result;

    default:
      return state;
  }
};

export { reducer as Reducer };
