import { Injectable } from '@angular/core';

import { ActivatedRouteSnapshot, RouterStateSnapshot, Params } from '@angular/router';

import * as fromRouter from '@ngrx/router-store';

import { createFeatureSelector, MemoizedSelector } from '@ngrx/store';

export interface IRouterState {
  url: string;
  queryParams: Params;
  params: Params;
}

@Injectable()
export class RouterSelectors {
  public getRouterState: MemoizedSelector<object, fromRouter.RouterReducerState<IRouterState>>;

  constructor() {
    this.getRouterState = createFeatureSelector<fromRouter.RouterReducerState<IRouterState>>('router');
  }
}

export class CustomSerializer implements fromRouter.RouterStateSerializer<IRouterState> {
  serialize(routerState: RouterStateSnapshot): IRouterState {
    const { url } = routerState;
    const { queryParams } = routerState.root;

    let state: ActivatedRouteSnapshot = routerState.root;
    while (state.firstChild) {
      state = state.firstChild;
    }
    const { params } = state;

    return { url, queryParams, params };
  }
}
