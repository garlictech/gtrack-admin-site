import * as _ from 'lodash';

import { IState } from '../state';

export const createFeatureState = ({
  progressSpinnerOn = true,
  progressSpinnerText = 'foobar'
} = {}): IState => ({
  progressSpinnerOn,
  progressSpinnerText
});

export const createState = (stateParams?): { 'features.generic-ui': IState } => ({
  'features.generic-ui': createFeatureState(stateParams)
});
