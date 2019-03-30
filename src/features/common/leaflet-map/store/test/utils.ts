import { featureName, State } from '../state';

export const createFeatureState = ({ mapId = 'foobar', featureId } = {}): State => ({
  mapId,
  featureId
});

export const createState = (stateParams?): { [featureName]: State } => ({
  [featureName]: createFeatureState(stateParams)
});
