import { EntityAdapter, EntityState } from '@ngrx/entity';
import { IWikipediaPoi, IGooglePoi, IOsmPoi } from 'app/shared/interfaces';

export interface IWikipediaPoiEntityState extends EntityState<IWikipediaPoi> {};
export interface IGooglePoiEntityState extends EntityState<IGooglePoi> {};
export interface IOsmAmenityPoiEntityState extends EntityState<IOsmPoi> {};
export interface IOsmNaturalPoiEntityState extends EntityState<IOsmPoi> {};
export interface IOsmRoutePoiEntityState extends EntityState<IOsmPoi> {};

export interface IExternalPoiListContextItemState {
  loading: boolean;
  loaded: boolean;
  showOnrouteMarkers?: boolean;
  showOffrouteMarkers?: boolean;
  dirty?: boolean;
}

export interface IExternalPoiListContextState {
  google: IExternalPoiListContextItemState;
  osmAmenity: IExternalPoiListContextItemState;
  osmNatural: IExternalPoiListContextItemState;
  osmRoute: IExternalPoiListContextItemState;
  wikipedia: IExternalPoiListContextItemState;
  gTrack: IExternalPoiListContextItemState; // context for common Poi list
  hike: IExternalPoiListContextItemState; // context for hike Poi list
}

// State
export interface IHikeEditPoiState {
  googlePois: IGooglePoiEntityState;
  osmAmenityPois: IOsmAmenityPoiEntityState;
  osmNaturalPois: IOsmNaturalPoiEntityState;
  osmRoutePois: IOsmRoutePoiEntityState;
  wikipediaPois: IWikipediaPoiEntityState;
  contexts: IExternalPoiListContextState;
}
