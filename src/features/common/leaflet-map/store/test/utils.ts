import { featureName, State } from '../state';

// tslint:disable-next-line:no-unnecessary-initializer
export const createFeatureState = ({ mapId = 'foobar', featureId = undefined } = {}): State => ({
  mapId,
  featureId
});

export const createState = (stateParams?: any): { [featureName]: State } => ({
  [featureName]: createFeatureState(stateParams)
});
