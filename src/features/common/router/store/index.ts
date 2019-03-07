import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import * as fromRouter from '@ngrx/router-store';
import * as _ from 'lodash';
import * as Actions from './actions';
import { RouterStateDesc } from './state';
export * from './actions';
export * from './effects';
export * from './selectors';

export { Actions as RouterActions };

export class CustomSerializer implements fromRouter.RouterStateSerializer<RouterStateDesc> {
  serialize(routerState: RouterStateSnapshot): RouterStateDesc {
    const { url } = routerState;
    const { queryParams } = routerState.root;

    let state: ActivatedRouteSnapshot = routerState.root;
    while (state.firstChild) {
      state = state.firstChild;
    }
    const { params, data } = state;

    return { url, queryParams, params, data };
  }
}
