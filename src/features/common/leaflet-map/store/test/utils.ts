import { State } from '../state';

export const createFeatureState = ({ mapId = 'foobar', featureId = undefined } = {}): State => ({
  mapId,
  featureId
});

export const createState = (stateParams?): { 'features.common.leaflet-map': State } => ({
  'features.common.leaflet-map': createFeatureState(stateParams)
});
