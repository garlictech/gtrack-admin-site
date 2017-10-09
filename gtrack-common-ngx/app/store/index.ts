import { ModuleWithProviders } from '@angular/core';
import { storeLogger } from 'ngrx-store-logger';
import { StoreModule, combineReducers } from '@ngrx/store';
import { compose } from '@ngrx/core/compose';

// A module with store must export its reducers and its store interface.
// import * as Authentication from '../authentication/store'
// import * as ActorList from '../videolist/store';

// Add the store interface of the module to the global reducers.
const reducer = {
  // authentication: Authentication.Reducer,
  // actorList: ActorList.Reducer,
};


// Extend the store interface with that.
export interface State {
  // authentication: Authentication.IAuthenticationState,
  // actorList: ActorList.IActorListState,
}


// export const store = StoreModule.provideStore(reducer)
export const store: ModuleWithProviders = StoreModule.provideStore(compose(storeLogger(), combineReducers)(reducer));
