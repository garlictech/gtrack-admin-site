import * as _ from 'lodash';

import { State } from '../state';

export const createFeatureState = ({ mapId = 'foobar' } = {}): State => ({
  mapId
});

export const createState = (stateParams?): { 'features.leaflet-map': State } => ({
  'features.leaflet-map': createFeatureState(stateParams)
});
