import { Injectable } from '@angular/core';
import { State } from '../index';
import { createSelector, createFeatureSelector, MemoizedSelector } from '@ngrx/store/src/selector';
import { IHikeEditMapState } from '../state/index';
import {
  wikipediaMarkerAdapter, googleMarkerAdapter, osmAmenityMarkerAdapter, osmNaturalMarkerAdapter, osmRouteMarkerAdapter
} from 'app/store/reducer';
import { AdminMapMarker } from 'app/shared/services/admin-map';

@Injectable()
export class HikeEditMapSelectors {
  public hikeEditMapSelector: MemoizedSelector<object, IHikeEditMapState>;
  public getAllWikipediaMarkers: (state: object) => AdminMapMarker[];
  public getAllGoogleMarkers: (state: object) => AdminMapMarker[];
  public getAllOsmAmenityMarkers: (state: object) => AdminMapMarker[];
  public getAllOsmNaturalMarkers: (state: object) => AdminMapMarker[];
  public getAllOsmRouteMarkers: (state: object) => AdminMapMarker[];

  constructor() {
    this.hikeEditMapSelector = createFeatureSelector<IHikeEditMapState>('hikeEditMap');

    /**
     * Marker entity lists
     */

    const wikipediaMarkerSelector = createSelector(
      this.hikeEditMapSelector, (state: IHikeEditMapState) => state.wikipediaMarkers
    );
    this.getAllWikipediaMarkers = wikipediaMarkerAdapter.getSelectors(wikipediaMarkerSelector).selectAll;

    const googleMarkerSelector = createSelector(
      this.hikeEditMapSelector, (state: IHikeEditMapState) => state.googleMarkers
    );
    this.getAllGoogleMarkers = googleMarkerAdapter.getSelectors(googleMarkerSelector).selectAll;

    const osmAmenityMarkerSelector = createSelector(
      this.hikeEditMapSelector, (state: IHikeEditMapState) => state.osmAmenityMarkers
    );
    this.getAllOsmAmenityMarkers = osmAmenityMarkerAdapter.getSelectors(osmAmenityMarkerSelector).selectAll;

    const osmNaturalMarkerSelector = createSelector(
      this.hikeEditMapSelector, (state: IHikeEditMapState) => state.osmNaturalMarkers
    );
    this.getAllOsmNaturalMarkers = osmNaturalMarkerAdapter.getSelectors(osmNaturalMarkerSelector).selectAll;

    const osmRouteMarkerSelector = createSelector(
      this.hikeEditMapSelector, (state: IHikeEditMapState) => state.osmRouteMarkers
    );
    this.getAllOsmRouteMarkers = osmRouteMarkerAdapter.getSelectors(osmRouteMarkerSelector).selectAll;
  }

  public getHikeEditMapMapIdSelector() {
    return createSelector(this.hikeEditMapSelector,
      (state: IHikeEditMapState) => state.map.mapId);
  };
}
