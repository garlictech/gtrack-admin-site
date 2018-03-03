import { Injectable } from '@angular/core';
import { createSelector, createFeatureSelector, MemoizedSelector } from '@ngrx/store/src/selector';
import { State } from '../index';
import { IHikeEditPoiState } from '../state/index';
import {
  wikipediaPoiAdapter, googlePoiAdapter, osmAmenityPoiAdapter, osmNaturalPoiAdapter, osmRoutePoiAdapter, gTrackPoiAdapter
} from 'app/store/reducer';
import {
  IExternalPoi, IWikipediaPoi, IGooglePoi, IOsmPoi, IGTrackPoi
} from 'app/shared/interfaces';

@Injectable()
export class HikeEditPoiSelectors {
  public hikeEditPoiSelector: MemoizedSelector<object, IHikeEditPoiState>;
  public getAllWikipediaPois: (state: object) => IWikipediaPoi[];
  public getAllGooglePois: (state: object) => IGooglePoi[];
  public getAllOsmAmenityPois: (state: object) => IOsmPoi[];
  public getAllOsmNaturalPois: (state: object) => IOsmPoi[];
  public getAllOsmRoutePois: (state: object) => IOsmPoi[];
  public getAllGTrackPois: (state: object) => IGTrackPoi[];

  constructor() {
    this.hikeEditPoiSelector = createFeatureSelector<IHikeEditPoiState>('hikeEditPoi');

    /**
     * Poi entity lists
     */

    const googlePoiSelector = createSelector(
      this.hikeEditPoiSelector, (state: IHikeEditPoiState) => state.googlePois
    );
    this.getAllGooglePois = googlePoiAdapter.getSelectors(googlePoiSelector).selectAll;

    const osmAmenityPoiSelector = createSelector(
      this.hikeEditPoiSelector, (state: IHikeEditPoiState) => state.osmAmenityPois
    );
    this.getAllOsmAmenityPois = osmAmenityPoiAdapter.getSelectors(osmAmenityPoiSelector).selectAll;

    const osmNaturalPoiSelector = createSelector(
      this.hikeEditPoiSelector, (state: IHikeEditPoiState) => state.osmNaturalPois
    );
    this.getAllOsmNaturalPois = osmNaturalPoiAdapter.getSelectors(osmNaturalPoiSelector).selectAll;

    const osmRoutePoiSelector = createSelector(
      this.hikeEditPoiSelector, (state: IHikeEditPoiState) => state.osmRoutePois
    );
    this.getAllOsmRoutePois = osmRoutePoiAdapter.getSelectors(osmRoutePoiSelector).selectAll;

    const wikipediaPoiSelector = createSelector(
      this.hikeEditPoiSelector, (state: IHikeEditPoiState) => state.wikipediaPois
    );
    this.getAllWikipediaPois = wikipediaPoiAdapter.getSelectors(wikipediaPoiSelector).selectAll;

    const gtrackPoiSelector = createSelector(
      this.hikeEditPoiSelector, (state: IHikeEditPoiState) => state.gTrackPois
    );
    this.getAllGTrackPois = gTrackPoiAdapter.getSelectors(gtrackPoiSelector).selectAll;
  }

  /**
   * Context
   */

  public getHikeEditContextSelector(poiType) {
    return createSelector(this.hikeEditPoiSelector,
      (state: IHikeEditPoiState) => state.contexts[poiType]);
  };

  public getHikeEditContextPropertySelector(poiType, property) {
    return createSelector(this.hikeEditPoiSelector,
      (state: IHikeEditPoiState) => state.contexts[poiType][property]);
  };
}
