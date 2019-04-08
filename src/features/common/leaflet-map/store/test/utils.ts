import { State } from '../state';

export const createFeatureState = ({ mapId = 'foobar', featureId = undefined } = {}): State => ({
  mapId,
  featureId
});

export const createState = (stateParams?): { 'features.leaflet-map': State } => ({
  'features.leaflet-map': createFeatureState(stateParams)
});
