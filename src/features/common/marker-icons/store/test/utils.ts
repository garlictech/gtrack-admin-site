import * as _ from 'lodash';
import { featureName, State, SvgContent } from '../state';

export const createSvgContent = (id: string): SvgContent => ({
  id,
  content: '<svg><path id="icon" fill="#7C7CF0"></path></svg>'
});

export const createSvgContentEntityState = (svgContents: Array<SvgContent>) => ({
  ids: _.map(svgContents, 'id'),
  entities: _.keyBy(svgContents, 'id')
});

export const createFeatureState = ({ markers, icons } = {}): State => ({
  markers,
  icons
});

export const createState = (stateParams?): { [featureName]: State } => ({
  [featureName]: createFeatureState(stateParams)
});
