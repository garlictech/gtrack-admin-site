import { InjectionToken } from '@angular/core';
import { ActionReducer, ActionReducerMap } from '@ngrx/store';
import * as Actions from './actions';

import { reducer } from './reducer';

export { Actions };

export type Action = Actions.AllActions;
export { Effects } from './effects';

export * from './state';
export { reducer as Reducer } from './reducer';
export { DeepstreamSelectors } from './selectors';
import { DeepstreamState } from './state';

// tslint:disable-next-line: only-arrow-functions
export function getReducers(): ActionReducer<DeepstreamState> {
  return reducer;
}

export const DEEPSTREAM_REDUCER_TOKEN = new InjectionToken<ActionReducerMap<DeepstreamState>>(
  'Registered Deepstream Reducers'
);
