import { EntityAdapter, EntityState } from '@ngrx/entity';
import { AdminMapMarker } from 'app/shared/services/admin-map';

/**
 * Map
 */

export interface IHikeEditMapMapState {
  mapId: string;
}

/**
 * Markers
 */

export interface IWikipediaMarkerEntityState extends EntityState<AdminMapMarker> {};
export interface IGoogleMarkerEntityState extends EntityState<AdminMapMarker> {};
export interface IOsmAmenityMarkerEntityState extends EntityState<AdminMapMarker> {};
export interface IOsmNaturalMarkerEntityState extends EntityState<AdminMapMarker> {};
export interface IOsmRouteMarkerEntityState extends EntityState<AdminMapMarker> {};
export interface IGTrackMarkerEntityState extends EntityState<AdminMapMarker> {};

/**
 * State
 */
export interface IHikeEditMapState {
  wikipediaMarkers: IWikipediaMarkerEntityState,
  googleMarkers: IGoogleMarkerEntityState,
  osmAmenityMarkers: IOsmAmenityMarkerEntityState,
  osmNaturalMarkers: IOsmNaturalMarkerEntityState,
  osmRouteMarkers: IOsmRouteMarkerEntityState,
  gTrackMarkers: IGTrackMarkerEntityState,
  map: IHikeEditMapMapState
};
