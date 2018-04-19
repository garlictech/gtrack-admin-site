import { Injectable } from '@angular/core';
import { createSelector, createFeatureSelector, MemoizedSelector } from '@ngrx/store';

import { State } from '../index';
import { IHikeEditPoiState } from '../state/index';
import {
  wikipediaPoiAdapter, googlePoiAdapter, osmAmenityPoiAdapter, osmNaturalPoiAdapter, osmRoutePoiAdapter
} from 'app/store/reducer';
import { IExternalPoi, IWikipediaPoi, IGooglePoi, IOsmPoi } from 'app/shared/interfaces';

@Injectable()
export class HikeEditPoiSelectors {
  private _featureSelector: MemoizedSelector<object, IHikeEditPoiState>;
  public getAllWikipediaPois: (state: object) => IWikipediaPoi[];
  public getAllGooglePois: (state: object) => IGooglePoi[];
  public getAllOsmAmenityPois: (state: object) => IOsmPoi[];
  public getAllOsmNaturalPois: (state: object) => IOsmPoi[];
  public getAllOsmRoutePois: (state: object) => IOsmPoi[];

  constructor() {
    this._featureSelector = createFeatureSelector<IHikeEditPoiState>('hikeEditPoi');

    //
    // Poi entity lists
    //

    const googlePoiSelector = createSelector(
      this._featureSelector, (state: IHikeEditPoiState) => state.googlePois
    );
    this.getAllGooglePois = googlePoiAdapter.getSelectors(googlePoiSelector).selectAll;

    const osmAmenityPoiSelector = createSelector(
      this._featureSelector, (state: IHikeEditPoiState) => state.osmAmenityPois
    );
    this.getAllOsmAmenityPois = osmAmenityPoiAdapter.getSelectors(osmAmenityPoiSelector).selectAll;

    const osmNaturalPoiSelector = createSelector(
      this._featureSelector, (state: IHikeEditPoiState) => state.osmNaturalPois
    );
    this.getAllOsmNaturalPois = osmNaturalPoiAdapter.getSelectors(osmNaturalPoiSelector).selectAll;

    const osmRoutePoiSelector = createSelector(
      this._featureSelector, (state: IHikeEditPoiState) => state.osmRoutePois
    );
    this.getAllOsmRoutePois = osmRoutePoiAdapter.getSelectors(osmRoutePoiSelector).selectAll;

    const wikipediaPoiSelector = createSelector(
      this._featureSelector, (state: IHikeEditPoiState) => state.wikipediaPois
    );
    this.getAllWikipediaPois = wikipediaPoiAdapter.getSelectors(wikipediaPoiSelector).selectAll;
  }

  //
  // Context
  //

  public getHikeEditPoiContextSelector(subdomain) {
    return createSelector(this._featureSelector, (state: IHikeEditPoiState) => state.contexts[subdomain]);
  };

  public getHikeEditPoiContextPropertySelector(subdomain, property) {
    return createSelector(this._featureSelector, (state: IHikeEditPoiState) => state.contexts[subdomain][property]);
  };
}
