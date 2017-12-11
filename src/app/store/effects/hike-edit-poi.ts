import { Injectable } from '@angular/core';
import { Actions, Effect, toPayload } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Rx';
import { State, hikeEditPoiActions } from '../index';
import {
  OsmPoiService,
  OsmRoutePoiService,
  WikipediaPoiService,
  PoiEditorService,
  GooglePoiService,
  AdminMapService
} from 'app/shared/services';
import { AdminMap } from 'app/shared/services/admin-map/admin-map';
import { IExternalPoi } from 'app/shared/interfaces/index';
import { ExternalPoi } from 'app/shared/services/poi/external-poi';
import * as _ from 'lodash';

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
    private _adminMapService: AdminMapService
  ) {}

  @Effect()
  getWikipediaPois$: Observable<Action> = this._actions$
    .ofType(hikeEditPoiActions.GET_WIKIPEDIA_POIS)
    .map(toPayload)
    .switchMap(data => {
      return this._wikipediaPoiService.get(data.bounds).then((pois) => {
        return _.extend(_.cloneDeep(data), {pois: pois});
      });
    })
    .switchMap(data => this._poiEditorService.assignGTrackPois(data))
    .switchMap(data => this._poiEditorService.assignOrganizedPois(data))
    .map(data => {
      const _pois = this._poiEditorService.assignOnOffRoutePois(data);
      return new hikeEditPoiActions.SetWikipediaPois({
        pois: _pois
      });
    });

  @Effect()
  getGooglePois$: Observable<any> = this._actions$
    .ofType(hikeEditPoiActions.GET_GOOGLE_POIS)
    .map(toPayload)
    .switchMap(data => {
      return this._googlePoiService.get(data.bounds).then((pois) => {
        return _.extend(_.cloneDeep(data), {pois: pois});
      });
    })
    .switchMap(data => this._poiEditorService.assignGTrackPois(data))
    .switchMap(data => this._poiEditorService.assignOrganizedPois(data))
    .map(data => {
      const _pois = this._poiEditorService.assignOnOffRoutePois(data);
      return new hikeEditPoiActions.SetGooglePois({
        pois: _pois
      });
    });

  @Effect()
  getOsmNaturalPois$: Observable<Action> = this._actions$
    .ofType(hikeEditPoiActions.GET_OSM_NATURAL_POIS)
    .map(toPayload)
    .switchMap(data => {
      return this._osmPoiService.get(data.bounds, 'natural').then((pois) => {
        return _.extend(_.cloneDeep(data), {pois: pois});
      });
    })
    .switchMap(data => this._poiEditorService.assignGTrackPois(data))
    .switchMap(data => this._poiEditorService.assignOrganizedPois(data))
    .map(data => {
      const _pois = this._poiEditorService.assignOnOffRoutePois(data);
      return new hikeEditPoiActions.SetOsmNaturalPois({
        pois: _pois
      });
    });

  @Effect()
  getOsmAmenityPois$: Observable<Action> = this._actions$
    .ofType(hikeEditPoiActions.GET_OSM_AMENITY_POIS)
    .map(toPayload)
    .switchMap(data => {
      return this._osmPoiService.get(data.bounds, 'amenity').then((pois) => {
        return _.extend(_.cloneDeep(data), {pois: pois});
      });
    })
    .switchMap(data => this._poiEditorService.assignGTrackPois(data))
    .switchMap(data => this._poiEditorService.assignOrganizedPois(data))
    .map(data => {
      const _pois = this._poiEditorService.assignOnOffRoutePois(data);
      return new hikeEditPoiActions.SetOsmAmenityPois({
        pois: _pois
      });
    });

  @Effect()
  getOsmRoutePois$: Observable<Action> = this._actions$
    .ofType(hikeEditPoiActions.GET_OSM_ROUTE_POIS)
    .map(toPayload)
    .switchMap(data => {
      return this._osmRoutePoiService.get(data.bounds, data.typeParam).then((pois) => {
        return _.extend(_.cloneDeep(data), {pois: pois});
      });
    })
    .switchMap(data => this._poiEditorService.assignGTrackPois(data))
    .switchMap(data => this._poiEditorService.assignOrganizedPois(data))
    .map(data => {
      const _pois = this._poiEditorService.assignOnOffRoutePois(data);
      return new hikeEditPoiActions.SetOsmRoutePois({
        pois: _pois
      });
    });

  @Effect()
  markersConfigChanged$: Observable<any> = this._actions$
    .ofType(hikeEditPoiActions.MARKERS_CONFIG_CHANGED)
    .map((action: hikeEditPoiActions.MarkersConfigChanged) => action.payload)
    .mergeMap(data => {
      return this._store.select((state: State) => state.hikeEditPoi[data.subdomain])
        .map((subdomainData) => {
          return _.extend(_.cloneDeep(data), subdomainData);
        });
    })
    // data now containts payload + map + pois
    .mergeMap(data => {
      this._poiEditorService.handleMarkerChanged(data);
      return Observable.empty<Response>();
    });
}
