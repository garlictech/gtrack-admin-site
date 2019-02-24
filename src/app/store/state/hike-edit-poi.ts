import { EntityState } from '@ngrx/entity';

import { GooglePoi, IOsmPoi, WikipediaPoi } from '../../shared/interfaces';

export interface WikipediaPoiEntityState extends EntityState<WikipediaPoi {}
export interface GooglePoiEntityState extends EntityState<GooglePoi> {}
export interface OsmAmenityPoiEntityState extends EntityState<IOsmPoi> {}
export interface OsmNaturalPoiEntityState extends EntityState<IOsmPoi> {}
export interface OsmRoutePoiEntityState extends EntityState<IOsmPoi> {}
export interface PoiCollectorEntityState extends EntityState<any> {}

export interface ExternalPoiListContextItemState {
  loading: boolean;
  loaded: boolean;
  saving: boolean;
  processing: boolean;
  showOnrouteMarkers?: boolean;
  showOffrouteMarkers?: boolean;
}

export interface ExternalPoiListContextState {
  google: ExternalPoiListContextItemState;
  osmAmenity: ExternalPoiListContextItemState;
  osmNatural: ExternalPoiListContextItemState;
  osmRoute: ExternalPoiListContextItemState;
  wikipedia: ExternalPoiListContextItemState;
  collector: ExternalPoiListContextItemState;
  gTrack: ExternalPoiListContextItemState; // context for common Poi list
  hike: ExternalPoiListContextItemState; // context for hike Poi list
}

export interface GTrackPoiMergeState {
  selections: Array<string>;
}

// State
export interface HikeEditPoiState {
  googlePois: GooglePoiEntityState;
  osmAmenityPois: OsmAmenityPoiEntityState;
  osmNaturalPois: OsmNaturalPoiEntityState;
  osmRoutePois: OsmRoutePoiEntityState;
  wikipediaPois: WikipediaPoiEntityState;
  collectorPois: PoiCollectorEntityState;
  contexts: ExternalPoiListContextState;
  gTrackPoiMerge: GTrackPoiMergeState;
}
