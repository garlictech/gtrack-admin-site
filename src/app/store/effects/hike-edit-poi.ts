import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Rx';
import { MapMarkerService, IconService, GeoSearchService, PoiService } from 'subrepos/gtrack-common-ngx';
import {
  State, hikeEditPoiActions, hikeEditMapActions, IExternalPoiListContextItemState, commonGeoSearchActions
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
    .map((action: hikeEditPoiActions.GetWikipediaPois) => action.payload)
    .switchMap(data => {
      return this._wikipediaPoiService.get(data.bounds).then((pois) =>  {
        return _.extend(_.cloneDeep(data), { pois: pois });
      });
    })
    .switchMap(data => this._poiEditorService.assignGTrackPois(data))
    .switchMap(data => this._poiEditorService.assignOrganizedPois(data))
    .map(data => {
      return new hikeEditPoiActions.SetWikipediaPois({
        pois: this._poiEditorService.assignOnOffRoutePois(data)
      });
    });

  /**
   * Get pois from Google api
   */
  @Effect()
  getGooglePois$: Observable<any> = this._actions$
    .ofType(hikeEditPoiActions.GET_GOOGLE_POIS)
    .map((action: hikeEditPoiActions.GetGooglePois) => action.payload)
    .switchMap(data => {
      return this._googlePoiService.get(data.bounds).then((pois) =>  {
        return _.extend(_.cloneDeep(data), { pois: pois });
      });
    })
    .switchMap(data => this._poiEditorService.assignGTrackPois(data))
    .switchMap(data => this._poiEditorService.assignOrganizedPois(data))
    .map(data => {
      return new hikeEditPoiActions.SetGooglePois({
        pois: this._poiEditorService.assignOnOffRoutePois(data)
      });
    });

  /**
   * Get pois from OSM api
   */
  @Effect()
  getOsmNaturalPois$: Observable<Action> = this._actions$
    .ofType(hikeEditPoiActions.GET_OSM_NATURAL_POIS)
    .map((action: hikeEditPoiActions.GetOsmNaturalPois) => action.payload)
    .switchMap(data => {
      return this._osmPoiService.get(data.bounds, 'natural').then((pois) =>  {
        return _.extend(_.cloneDeep(data), { pois: pois });
      });
    })
    .switchMap(data => this._poiEditorService.assignGTrackPois(data))
    .switchMap(data => this._poiEditorService.assignOrganizedPois(data))
    .map(data => {
      return new hikeEditPoiActions.SetOsmNaturalPois({
        pois: this._poiEditorService.assignOnOffRoutePois(data)
      });
    });

  /**
   * Get pois from OSM api
   */
  @Effect()
  getOsmAmenityPois$: Observable<Action> = this._actions$
    .ofType(hikeEditPoiActions.GET_OSM_AMENITY_POIS)
    .map((action: hikeEditPoiActions.GetOsmAmenityPois) => action.payload)
    .switchMap(data => {
      return this._osmPoiService.get(data.bounds, 'amenity').then((pois) =>  {
        return _.extend(_.cloneDeep(data), { pois: pois });
      });
    })
    .switchMap(data => this._poiEditorService.assignGTrackPois(data))
    .switchMap(data => this._poiEditorService.assignOrganizedPois(data))
    .map(data => {
      return new hikeEditPoiActions.SetOsmAmenityPois({
        pois: this._poiEditorService.assignOnOffRoutePois(data)
      });
    });

  /**
   * Get pois from OSM api
   */
  @Effect()
  getOsmRoutePois$: Observable<Action> = this._actions$
    .ofType(hikeEditPoiActions.GET_OSM_ROUTE_POIS)
    .map((action: hikeEditPoiActions.GetOsmRoutePois) => action.payload)
    .switchMap(data => {
      return this._osmRoutePoiService.get(data.bounds).then((pois) =>  {
        return _.extend(_.cloneDeep(data), { pois: pois });
      });
    })
    .switchMap(data => this._poiEditorService.assignGTrackPois(data))
    .switchMap(data => this._poiEditorService.assignOrganizedPois(data))
    .map(data => {
      return new hikeEditPoiActions.SetOsmRoutePois({
        pois: this._poiEditorService.assignOnOffRoutePois(data)
      });
    });

  /**
   * Get gTrack pois from db
   */
  @Effect()
  getGtrackPois$: Observable<Action> = this._actions$
    .ofType(hikeEditPoiActions.GET_GTRACK_POIS)
    .map((action: hikeEditPoiActions.GetGTrackPois) => action.payload)
    .switchMap(data => {
      return this._geoSearchService
        .searchCircle({
          table: 'pois',
          circle: {
            radius: data.radius,
            center: [data.centerCoord[0], data.centerCoord[1]]
          }
        })
        .flatMap((poiIds: string[]) => {
          return Observable
            .combineLatest(...poiIds.map(poiId => {
              return this._poiService.get(poiId);
            }))
            .map(pois => {
              return _.extend(_.cloneDeep(data), { pois: pois });
            });
        });
    })
    .switchMap(data => this._poiEditorService.assignOrganizedPois(data))
    .switchMap(data => this._poiEditorService.handleHikeInclusion(data))
    .map(data => {
      return new hikeEditPoiActions.SetGTrackPois({
        pois: this._poiEditorService.assignOnOffRoutePois(data)
      });
    });

  /**
   * Refresh poi markers for the given subdomain
   */
  @Effect()
  generateSubdomainPoiMarkers$: Observable<Action> = this._actions$
    .ofType(hikeEditPoiActions.GENERATE_SUBDOMAIN_POI_MARKERS)
    .map((action: hikeEditPoiActions.GenerateSubdomainPoiMarkers) => action.payload)
    // Load old markers for removing them from the map
    .switchMap(data => this._poiEditorService.getSubdomainMarkers(data))
    .switchMap(data => this._poiEditorService.clearSubdomainPoiMarkers(data))
    .switchMap(data => this._poiEditorService.getSubdomainPois(data))
    .map(data => this._poiEditorService.generatePoiMarkers(data))
    .map((data: any) => {
      switch (data.subdomain) {
        case 'google':
          return new hikeEditMapActions.SetGoogleMarkers({markers: data.markers});
        case 'osmAmenity':
          return new hikeEditMapActions.SetOsmAmenityMarkers({markers: data.markers});
        case 'osmNatural':
          return new hikeEditMapActions.SetOsmNaturalMarkers({markers: data.markers});
        case 'osmRoute':
          return new hikeEditMapActions.SetOsmRouteMarkers({markers: data.markers});
        case 'wikipedia':
          return new hikeEditMapActions.SetWikipediaMarkers({markers: data.markers});
        default:
          return new hikeEditMapActions.SetGTrackMarkers({markers: data.markers});
      }
    });

  /**
   * Refresh marker visibility for the given subdomain
   */
  @Effect()
  markersConfigChanged$: Observable<any> = this._actions$
    .ofType(hikeEditPoiActions.MARKERS_CONFIG_CHANGED)
    .map((action: hikeEditPoiActions.MarkersConfigChanged) => action.payload)
    .switchMap(data => this._poiEditorService.getSubdomainMarkers(data))
    .switchMap(data => this._poiEditorService.clearSubdomainPoiMarkers(data))
    .switchMap(data => this._poiEditorService.getSubdomainPois(data))
    .switchMap(data => this._poiEditorService.getSubdomainContext(data))
    .switchMap(data => {
      this._poiEditorService.handleMarkerChanged(data);
      return Observable.empty<Response>();
    });
}
