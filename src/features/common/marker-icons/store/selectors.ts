import { createFeatureSelector, createSelector } from '@ngrx/store';

import { EIconStyle } from '../enums';
import { getFileId, prepareSvg } from '../pure';
import { svgIconContentAdapter, svgMarkerContentAdapter } from './reducer';
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
    (svgContents: Array<SvgContent>) => {
      const fileId = getFileId(type);
      const svgContent: SvgContent =
        svgContents.find(s => s.id === fileId) || svgContents.find(s => s.id === 'asterisco');

      if (svgContent) {
        return prepareSvg(svgContent.content, fileId, encoded, iconStyle);
      } else {
        return undefined;
      }
    }
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
    (svgContents: Array<SvgContent>) => {
      const fileId = getFileId(type);
      const svgContent: SvgContent =
        svgContents.find(s => s.id === fileId) || svgContents.find(s => s.id === 'asterisco');

      if (svgContent) {
        return prepareSvg(svgContent.content, fileId, encoded, iconStyle);
      } else {
        return undefined;
      }
    }
  );
