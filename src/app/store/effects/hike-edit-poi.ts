import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Rx';
import { MapMarkerService, IconService, GeoSearchService, PoiService } from 'subrepos/gtrack-common-ngx';
import {
  State, hikeEditPoiActions, hikeEditMapActions, IExternalPoiListContextItemState, commonGeoSearchActions, commonPoiActions, editedGTrackPoiActions
} from '../index';
import { HikeEditPoiSelectors } from 'app/store/selectors/'
import {
  OsmPoiService,
  OsmRoutePoiService,
  WikipediaPoiService,
  PoiEditorService,
  GooglePoiService,
  AdminMapService
} from 'app/shared/services';
import { AdminMap, AdminMapMarker } from 'app/shared/services/admin-map';
import { IExternalPoi, IWikipediaPoi, IOsmPoi, IGooglePoi } from 'app/shared/interfaces';
import { ExternalPoi } from 'app/shared/services/poi/external-poi';

import * as _ from 'lodash';
import * as uuid from 'uuid/v1';

@Injectable()
export class HikeEditPoiEffects {
  constructor(
    private _actions$: Actions,
    private _store: Store<State>,
    private _wikipediaPoiService: WikipediaPoiService,
    private _osmPoiService: OsmPoiService,
    private _osmRoutePoiService: OsmRoutePoiService,
    private _googlePoiService: GooglePoiService,
    private _poiEditorService: PoiEditorService,
    private _adminMapService: AdminMapService,
    private _hikeEditPoiSelectors: HikeEditPoiSelectors,
    private _geoSearchService: GeoSearchService,
    private _poiService: PoiService
  ) {}

  /**
   * Get pois from WikiPedia api
   */
  @Effect()
  getWikipediaPois$: Observable<Action> = this._actions$
    .ofType(hikeEditPoiActions.GET_WIKIPEDIA_POIS)
    .map((action: hikeEditPoiActions.GetWikipediaPois) => action.bounds)
    .switchMap(bounds => {
      return this._wikipediaPoiService.get(bounds).then((pois: IWikipediaPoi[]) =>  {
        return new hikeEditPoiActions.SetWikipediaPois(pois);
      });
    });

  /**
   * Get pois from Google api
   */
  @Effect()
  getGooglePois$: Observable<any> = this._actions$
    .ofType(hikeEditPoiActions.GET_GOOGLE_POIS)
    .map((action: hikeEditPoiActions.GetGooglePois) => action.bounds)
    .switchMap(bounds => {
      return this._googlePoiService.get(bounds).then((pois: IGooglePoi[]) =>  {
        return new hikeEditPoiActions.SetGooglePois(pois);
      });
    });

  /**
   * Get pois from OSM api
   */
  @Effect()
  getOsmNaturalPois$: Observable<Action> = this._actions$
    .ofType(hikeEditPoiActions.GET_OSM_NATURAL_POIS)
    .map((action: hikeEditPoiActions.GetOsmNaturalPois) => action.bounds)
    .switchMap(bounds => {
      return this._osmPoiService.get(bounds, 'natural').then((pois: IOsmPoi[]) =>  {
        return new hikeEditPoiActions.SetOsmNaturalPois(pois);
      });
    });

  /**
   * Get pois from OSM api
   */
  @Effect()
  getOsmAmenityPois$: Observable<Action> = this._actions$
    .ofType(hikeEditPoiActions.GET_OSM_AMENITY_POIS)
    .map((action: hikeEditPoiActions.GetOsmAmenityPois) => action.bounds)
    .switchMap(bounds => {
      return this._osmPoiService.get(bounds, 'amenity').then((pois: IOsmPoi[]) =>  {
        return new hikeEditPoiActions.SetOsmAmenityPois(pois);
      });
    });

  /**
   * Get pois from OSM api
   */
  @Effect()
  getOsmRoutePois$: Observable<Action> = this._actions$
    .ofType(hikeEditPoiActions.GET_OSM_ROUTE_POIS)
    .map((action: hikeEditPoiActions.GetOsmRoutePois) => action.bounds)
    .switchMap(bounds => {
      return this._osmRoutePoiService.get(bounds).then((pois: IOsmPoi[]) =>  {
        return new hikeEditPoiActions.SetOsmRoutePois(pois);
      });
    });

  /**
   * Load gTrackPoi after save from servicePoi
   */
  @Effect()
  loadSavedPoi$: Observable<Action> = this._actions$
    .ofType<commonPoiActions.PoiSaved>(commonPoiActions.PoiActionTypes.POI_SAVED)
    .map(action => (new commonPoiActions.LoadPoi(action.context)));

  /**
   * Load gTrackPoi after modal edit
   */
  @Effect()
  loadModifiedPoi$: Observable<Action> = this._actions$
    .ofType<editedGTrackPoiActions.PoiSaveSuccess>(editedGTrackPoiActions.POI_SAVE_SUCCESS)
    .map(action => (new commonPoiActions.LoadPoi(action.poiId)));
}
