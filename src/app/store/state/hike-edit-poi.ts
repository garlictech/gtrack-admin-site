import { EntityAdapter, EntityState } from '@ngrx/entity';
import { IWikipediaPoi, IGooglePoi, IOsmPoi } from 'app/shared/interfaces';
import { IPoi } from 'subrepos/provider-client';

export interface IWikipediaPoiEntityState extends EntityState<IWikipediaPoi> {};
export interface IGooglePoiEntityState extends EntityState<IGooglePoi> {};
export interface IOsmAmenityPoiEntityState extends EntityState<IOsmPoi> {};
export interface IOsmNaturalPoiEntityState extends EntityState<IOsmPoi> {};
export interface IOsmRoutePoiEntityState extends EntityState<IOsmPoi> {};
export interface IGTrackPoiEntityState extends EntityState<IPoi> {};

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
  gTrack: IExternalPoiListContextItemState // todo --- ezzel!!
};

// State
export interface IHikeEditPoiState {
  googlePois: IGooglePoiEntityState,
  osmAmenityPois: IOsmAmenityPoiEntityState,
  osmNaturalPois: IOsmNaturalPoiEntityState,
  osmRoutePois: IOsmRoutePoiEntityState,
  wikipediaPois: IWikipediaPoiEntityState,
  gTrackPois: IGTrackPoiEntityState,
  contexts: IExternalPoiListContextState
};
