import { Injectable } from '@angular/core';
import { createSelector, createFeatureSelector, MemoizedSelector } from '@ngrx/store';
import { IHikeEditPoiState } from '../state/hike-edit-poi';
import {
  wikipediaPoiAdapter, googlePoiAdapter, osmAmenityPoiAdapter, osmNaturalPoiAdapter, osmRoutePoiAdapter
} from '../reducer';
import { IExternalPoi, IWikipediaPoi, IGooglePoi, IOsmPoi } from '../../shared/interfaces';

import * as _ from 'lodash';

@Injectable()
export class HikeEditPoiSelectors {
  private _featureSelector: MemoizedSelector<object, IHikeEditPoiState>;
  public getAllWikipediaPois: (state: object) => IWikipediaPoi[];
  public getAllGooglePois: (state: object) => IGooglePoi[];
  public getAllOsmAmenityPois: (state: object) => IOsmPoi[];
  public getAllOsmNaturalPois: (state: object) => IOsmPoi[];
  public getAllOsmRoutePois: (state: object) => IOsmPoi[];
  public getAllCollectorPois: (state: object) => any[];
  public getMergeSelections: (state: object) => string[];
  public getMergeSelectionsCount: (state: object) => number;
  private _allPoiSelectorMap = {}

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

    const collectedPoiSelector = createSelector(
      this._featureSelector, (state: IHikeEditPoiState) => state.collectorPois
    );
    this.getAllCollectorPois = wikipediaPoiAdapter.getSelectors(collectedPoiSelector).selectAll;

    this._allPoiSelectorMap = {
      'google': this.getAllGooglePois,
      'osmAmenity': this.getAllOsmAmenityPois,
      'osmNatural': this.getAllOsmNaturalPois,
      'osmRoute': this.getAllOsmRoutePois,
      'wikipedia': this.getAllWikipediaPois,
      'collector': this.getAllCollectorPois
    }

    this.getMergeSelections = createSelector(this._featureSelector,
      (state: IHikeEditPoiState) => state.gTrackPoiMerge.selections
    );

    this.getMergeSelectionsCount = createSelector(this._featureSelector,
      (state: IHikeEditPoiState) => state.gTrackPoiMerge.selections.length
    );
  }

  public getSaveablePoisCount(subdomain) {
    return createSelector(this._allPoiSelectorMap[subdomain], (pois: IExternalPoi[]) => {
      return pois.filter(p => p.selected && !p.inGtrackDb).length;
    });
  }

  public getSelectedCollectorPois() {
    return createSelector(this.getAllCollectorPois, (pois: any[]) => {
      return pois.filter(p => p.selected);
    });
  }

  public getCollectorPoi(poiId: string) {
    return createSelector(this.getAllCollectorPois, (pois: any[]) => pois.find(poi => poi.id === poiId));
  }

  public getCollectorPoisCount() {
    return createSelector(this.getAllCollectorPois, (pois: any[]) => pois.length);
  }

  public getPoiPhotos(subdomain) {
    return createSelector(this._allPoiSelectorMap[subdomain], (pois: IExternalPoi[]) => {
      let _photos = [];
      pois
        .filter(p => p[subdomain].photos && !p.inGtrackDb)
        .map(p => p[subdomain].photos)
        .map(photoArray => {
          _photos = _photos.concat(photoArray);
        });
      return _.uniqBy(_photos, 'original.url');
    });
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
