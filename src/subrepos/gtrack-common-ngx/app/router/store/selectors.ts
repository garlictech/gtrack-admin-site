// tslint:disable:max-classes-per-file
import { Injectable } from '@angular/core';

import { ActivatedRouteSnapshot, Params, RouterStateSnapshot } from '@angular/router';

import * as fromRouter from '@ngrx/router-store';

import { createFeatureSelector, MemoizedSelector } from '@ngrx/store';

export interface RouterState {
  url: string;
  queryParams: Params;
  params: Params;
  data: any;
}

@Injectable()
export class RouterSelectors {
  getRouterState: MemoizedSelector<object, fromRouter.RouterReducerState<RouterState>>;

  constructor() {
    this.getRouterState = createFeatureSelector<fromRouter.RouterReducerState<RouterState>>('router');
  }
}

export class CustomSerializer implements fromRouter.RouterStateSerializer<RouterState> {
  serialize(routerState: RouterStateSnapshot): RouterState {
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
