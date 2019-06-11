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

// tslint:disable-next-line:no-unnecessary-initializer
export const createFeatureState = ({ markers = undefined, icons = undefined, circles = undefined } = {}): State => ({
  markers,
  icons,
  circles
});

export const createState = (stateParams?: any): { [featureName]: State } => ({
  [featureName]: createFeatureState(stateParams)
});
