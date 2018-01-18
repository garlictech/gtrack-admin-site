import { EntityAdapter, EntityState } from '@ngrx/entity';
import { IWikipediaPoi, IGooglePoi, IOsmPoi } from 'app/shared/interfaces';

export interface IWikipediaPoiEntityState extends EntityState<IWikipediaPoi> {};
export interface IGooglePoiEntityState extends EntityState<IGooglePoi> {};
export interface IOsmNaturalPoiEntityState extends EntityState<IOsmPoi> {};
export interface IOsmAmenityPoiEntityState extends EntityState<IOsmPoi> {};
export interface IOsmRoutePoiEntityState extends EntityState<IOsmPoi> {};

// For poi lists
export interface IExternalPoiListContextState {
  id: string;
  loading: boolean;
  showOnrouteMarkers?: boolean;
  showOffrouteMarkers?: boolean;
}
export interface IExternalPoiListContextEntityState extends EntityState<IExternalPoiListContextState> {};

// State
export interface IHikeEditPoiState {
  wikipediaPois: IWikipediaPoiEntityState,
  googlePois: IGooglePoiEntityState,
  osmAmenityPois: IOsmAmenityPoiEntityState,
  osmNaturalPois: IOsmNaturalPoiEntityState,
  osmRoutePois: IOsmRoutePoiEntityState,
  contexts: IExternalPoiListContextEntityState
};
