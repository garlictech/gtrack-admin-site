import * as fromRouter from '@ngrx/router-store';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as _ from 'lodash';
import { featureName, RouterStateDesc } from './state';

const routerFeatureState = createFeatureSelector<fromRouter.RouterReducerState<RouterStateDesc>>(featureName);

export const selectRouteParams = createSelector(
  routerFeatureState,
  state => _.get(state, 'state.params')
);

export const selectRouteParam = createSelector(
  routerFeatureState,
  (state, param) => _.get(state, `state.params.${param}`)
);

export const selectUrl = createSelector(
  routerFeatureState,
  state => _.get(state, 'state.url')
);

export const selectRouteData = createSelector(
  routerFeatureState,
  state => _.get(state, 'state.data')
);
