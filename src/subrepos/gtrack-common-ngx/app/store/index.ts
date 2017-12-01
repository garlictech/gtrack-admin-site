import { ModuleWithProviders } from '@angular/core';
import { storeLogger } from 'ngrx-store-logger';
import { StoreModule, combineReducers, Action } from '@ngrx/store';
import { compose } from '@ngrx/store';
import { ActionReducer, MetaReducer } from '@ngrx/store/src/models';

// A module with store must export its reducers and its store interface.
// import * as Authentication from '../authentication/store'
// import * as ActorList from '../videolist/store';

// Add the store interface of the module to the global reducers.
const reducers = {
  // authentication: Authentication.Reducer,
  // actorList: ActorList.Reducer,
};

// For ngrx 4.x migration
export * from './actions';
export * from './effects';

// Extend the store interface with that.
export interface State {
  // authentication: Authentication.IAuthenticationState,
  // actorList: ActorList.IActorListState,
}

function logger(reducer: ActionReducer<State>): any {
  return storeLogger()(reducer);
}
const metaReducers: MetaReducer<State>[] = [logger];

export const store = StoreModule.forRoot(reducers, { metaReducers });
