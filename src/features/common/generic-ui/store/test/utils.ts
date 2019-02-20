import * as _ from 'lodash';

import { State } from '../state';

export const createFeatureState = ({ progressSpinnerOn = true, progressSpinnerText = 'foobar' } = {}): State => ({
  progressSpinnerOn,
  progressSpinnerText
});

export const createState = (stateParams?): { 'features.generic-ui': State } => ({
  'features.generic-ui': createFeatureState(stateParams)
});
