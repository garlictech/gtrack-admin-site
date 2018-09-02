import { Injectable } from '@angular/core';
import { createSelector, createFeatureSelector, MemoizedSelector } from '@ngrx/store';
import { IHikeEditImageState } from '../state/hike-edit-image';
import { mapillaryImageAdapter } from '../reducer';
import { IBackgroundImageData } from 'subrepos/provider-client';

@Injectable()
export class HikeEditImageSelectors {
  private _featureSelector: MemoizedSelector<object, IHikeEditImageState>;
  public getAllMapillaryImages: (state: object) => IBackgroundImageData[];

  constructor() {
    this._featureSelector = createFeatureSelector<IHikeEditImageState>('hikeEditImage');

    //
    // Image entity lists
    //

    const mapillaryImageSelector = createSelector(
      this._featureSelector, (state: IHikeEditImageState) => state.mapillaryImages
    );
    this.getAllMapillaryImages = mapillaryImageAdapter.getSelectors(mapillaryImageSelector).selectAll;
  }

  //
  // Context
  //

  public getHikeEditImageContextSelector(subdomain) {
    return createSelector(this._featureSelector, (state: IHikeEditImageState) => state.contexts[subdomain]);
  };

  public getHikeEditImageContextPropertySelector(subdomain, property) {
    return createSelector(this._featureSelector, (state: IHikeEditImageState) => state.contexts[subdomain][property]);
  };
}
