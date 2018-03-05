import { Injectable } from '@angular/core';
import { State } from '../index';
import { createSelector, createFeatureSelector, MemoizedSelector } from '@ngrx/store';
import { IHikeEditMapState } from '../state/index';
import {
  wikipediaMarkerAdapter, googleMarkerAdapter, osmAmenityMarkerAdapter, osmNaturalMarkerAdapter, osmRouteMarkerAdapter, gTrackMarkerAdapter
} from 'app/store/reducer';
import { AdminMapMarker } from 'app/shared/services/admin-map';

@Injectable()
export class HikeEditMapSelectors {
  private _featureSelector: MemoizedSelector<object, IHikeEditMapState>;
  public getMapId: MemoizedSelector<object, string>;
  public getAllWikipediaMarkers: (state: object) => AdminMapMarker[];
  public getAllGoogleMarkers: (state: object) => AdminMapMarker[];
  public getAllOsmAmenityMarkers: (state: object) => AdminMapMarker[];
  public getAllOsmNaturalMarkers: (state: object) => AdminMapMarker[];
  public getAllOsmRouteMarkers: (state: object) => AdminMapMarker[];
  public getAllGTrackMarkers: (state: object) => AdminMapMarker[];

  constructor() {
    this._featureSelector = createFeatureSelector<IHikeEditMapState>('hikeEditMap');

    //
    // Map
    //

    this.getMapId = createSelector(this._featureSelector,
      (state: IHikeEditMapState) => state.map.mapId
    );

    //
    // Marker entity lists
    //

    const wikipediaMarkerSelector = createSelector(
      this._featureSelector, (state: IHikeEditMapState) => state.wikipediaMarkers
    );
    this.getAllWikipediaMarkers = wikipediaMarkerAdapter.getSelectors(wikipediaMarkerSelector).selectAll;

    const googleMarkerSelector = createSelector(
      this._featureSelector, (state: IHikeEditMapState) => state.googleMarkers
    );
    this.getAllGoogleMarkers = googleMarkerAdapter.getSelectors(googleMarkerSelector).selectAll;

    const osmAmenityMarkerSelector = createSelector(
      this._featureSelector, (state: IHikeEditMapState) => state.osmAmenityMarkers
    );
    this.getAllOsmAmenityMarkers = osmAmenityMarkerAdapter.getSelectors(osmAmenityMarkerSelector).selectAll;

    const osmNaturalMarkerSelector = createSelector(
      this._featureSelector, (state: IHikeEditMapState) => state.osmNaturalMarkers
    );
    this.getAllOsmNaturalMarkers = osmNaturalMarkerAdapter.getSelectors(osmNaturalMarkerSelector).selectAll;

    const osmRouteMarkerSelector = createSelector(
      this._featureSelector, (state: IHikeEditMapState) => state.osmRouteMarkers
    );
    this.getAllOsmRouteMarkers = osmRouteMarkerAdapter.getSelectors(osmRouteMarkerSelector).selectAll;

    const gTrackMarkerSelector = createSelector(
      this._featureSelector, (state: IHikeEditMapState) => state.gTrackMarkers
    );
    this.getAllGTrackMarkers = gTrackMarkerAdapter.getSelectors(gTrackMarkerSelector).selectAll;
  }
}
