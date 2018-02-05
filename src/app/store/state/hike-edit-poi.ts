import { EntityAdapter, EntityState } from '@ngrx/entity';
import { IWikipediaPoi, IGooglePoi, IOsmPoi, IGTrackPoi } from 'app/shared/interfaces';

export interface IWikipediaPoiEntityState extends EntityState<IWikipediaPoi> {};
export interface IGooglePoiEntityState extends EntityState<IGooglePoi> {};
export interface IOsmAmenityPoiEntityState extends EntityState<IOsmPoi> {};
export interface IOsmNaturalPoiEntityState extends EntityState<IOsmPoi> {};
export interface IOsmRoutePoiEntityState extends EntityState<IOsmPoi> {};
export interface IGtrackPoiEntityState extends EntityState<IGTrackPoi> {};

export interface IExternalPoiListContextItemState {
  loading: boolean;
  showOnrouteMarkers?: boolean;
  showOffrouteMarkers?: boolean;
}

export interface IExternalPoiListContextState {
  google: IExternalPoiListContextItemState,
  osmAmenity: IExternalPoiListContextItemState,
  osmNatural: IExternalPoiListContextItemState,
  osmRoute: IExternalPoiListContextItemState,
  wikipedia: IExternalPoiListContextItemState
};

// State
export interface IHikeEditPoiState {
  googlePois: IGooglePoiEntityState,
  osmAmenityPois: IOsmAmenityPoiEntityState,
  osmNaturalPois: IOsmNaturalPoiEntityState,
  osmRoutePois: IOsmRoutePoiEntityState,
  wikipediaPois: IWikipediaPoiEntityState,
  gTrackPois: IGtrackPoiEntityState,
  contexts: IExternalPoiListContextState
};
