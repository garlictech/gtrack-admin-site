import * as _ from 'lodash';

import { IState } from '../state';

export const createFeatureState = ({ mapId = 'foobar' } = {}): IState => ({
  mapId
});

export const createState = (stateParams?): { 'features.leaflet-map': IState } => ({
  'features.leaflet-map': createFeatureState(stateParams)
});
