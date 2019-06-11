import { createFeatureSelector, createSelector } from '@ngrx/store';

import { EIconStyle } from '../enums';
import { getSvgContent } from '../pure';
import { svgCircleContentAdapter, svgIconContentAdapter, svgMarkerContentAdapter } from './reducer';
import { featureName, State, SvgContent } from './state';

export const featureSelector = createFeatureSelector<State>(featureName);

const svgIconSelector = createSelector(
  featureSelector,
  (state: State) => state.icons
);
export const getAllSvgIcons = svgIconContentAdapter.getSelectors(svgIconSelector).selectAll;
export const getAllSvgIconsCount = svgIconContentAdapter.getSelectors(svgIconSelector).selectTotal;

export const getIcon = (type: string, encoded: boolean, iconStyle: EIconStyle) =>
  createSelector(
    getAllSvgIcons,
    (svgContents: Array<SvgContent>) => getSvgContent(type, svgContents, encoded, iconStyle)
  );

const svgMarkerSelector = createSelector(
  featureSelector,
  (state: State) => state.markers
);
export const getAllSvgMarkers = svgMarkerContentAdapter.getSelectors(svgMarkerSelector).selectAll;
export const getAllSvgMarkersCount = svgMarkerContentAdapter.getSelectors(svgMarkerSelector).selectTotal;

export const getMarker = (type: string, encoded: boolean, iconStyle: EIconStyle) =>
  createSelector(
    getAllSvgMarkers,
    (svgContents: Array<SvgContent>) => getSvgContent(type, svgContents, encoded, iconStyle)
  );

const svgCircleSelector = createSelector(
  featureSelector,
  (state: State) => state.circles
);
export const getAllSvgCircles = svgCircleContentAdapter.getSelectors(svgCircleSelector).selectAll;
export const getAllSvgCirclesCount = svgCircleContentAdapter.getSelectors(svgCircleSelector).selectTotal;

export const getCircle = (type: string, encoded: boolean, iconStyle: EIconStyle) =>
  createSelector(
    getAllSvgCircles,
    (svgContents: Array<SvgContent>) => getSvgContent(type, svgContents, encoded, iconStyle)
  );
