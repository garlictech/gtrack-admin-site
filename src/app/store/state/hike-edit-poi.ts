import { EntityState } from '@ngrx/entity';
import { IWikipediaPoi, IGooglePoi, IOsmPoi } from '../../shared/interfaces';

export interface IWikipediaPoiEntityState extends EntityState<IWikipediaPoi> {};
export interface IGooglePoiEntityState extends EntityState<IGooglePoi> {};
export interface IOsmAmenityPoiEntityState extends EntityState<IOsmPoi> {};
export interface IOsmNaturalPoiEntityState extends EntityState<IOsmPoi> {};
export interface IOsmRoutePoiEntityState extends EntityState<IOsmPoi> {};
export interface IPoiCollectorEntityState extends EntityState<any> {};

export interface IExternalPoiListContextItemState {
  loading: boolean;
  loaded: boolean;
  saving: boolean;
  processing: boolean;
  showOnrouteMarkers?: boolean;
  showOffrouteMarkers?: boolean;
}

export interface IExternalPoiListContextState {
  google: IExternalPoiListContextItemState;
  osmAmenity: IExternalPoiListContextItemState;
  osmNatural: IExternalPoiListContextItemState;
  osmRoute: IExternalPoiListContextItemState;
  wikipedia: IExternalPoiListContextItemState;
  collector: IExternalPoiListContextItemState;
  gTrack: IExternalPoiListContextItemState; // context for common Poi list
  hike: IExternalPoiListContextItemState; // context for hike Poi list
}

export interface IGTrackPoiMergeState {
  selections: string[]
}

// State
export interface IHikeEditPoiState {
  googlePois: IGooglePoiEntityState;
  osmAmenityPois: IOsmAmenityPoiEntityState;
  osmNaturalPois: IOsmNaturalPoiEntityState;
  osmRoutePois: IOsmRoutePoiEntityState;
  wikipediaPois: IWikipediaPoiEntityState;
  collectorPois: IPoiCollectorEntityState;
  contexts: IExternalPoiListContextState;
  gTrackPoiMerge: IGTrackPoiMergeState;
}
