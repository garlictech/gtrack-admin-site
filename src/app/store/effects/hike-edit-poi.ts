import { Injectable } from '@angular/core';
import { Actions, Effect, toPayload } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Rx';
import { State } from '../index';
import { HikeEditPoiActions } from '../actions';
import {
  OsmPoiService,
  OsmRoutePoiService,
  WikipediaPoiService,
  PoiEditorService,
  GooglePoiService,
  AdminMapService
} from '../../shared/services';
import { AdminMap } from '../../shared/services/admin-map/admin-map';
import { IExternalPoi } from '../../shared/interfaces/index';
import { ExternalPoi } from '../../shared/services/poi/external-poi';
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
    private _adminMapService: AdminMapService,
    private _hikeEditPoiActions: HikeEditPoiActions
  ) {}

  @Effect()
  getWikipediaPois$: Observable<Action> = this._actions$
    .ofType(HikeEditPoiActions.GET_WIKIPEDIA_POIS)
    .map(toPayload)
    .switchMap(data => {
      return this._wikipediaPoiService.get(data.bounds).then((pois) => {
        return Object.assign(data, {pois: pois});
      });
    })
    .switchMap(data => this._poiEditorService.assignGTrackPois(data))
    .switchMap(data => this._poiEditorService.assignOrganizedPois(data))
    .map(data => {
      const _pois = this._poiEditorService.assignOnOffRoutePois(data);
      return this._hikeEditPoiActions.setWikipediaPois(_pois);
    });

  @Effect()
  getGooglePois$: Observable<any> = this._actions$
    .ofType(HikeEditPoiActions.GET_GOOGLE_POIS)
    .map(toPayload)
    .switchMap(data => {
      return this._googlePoiService.get(data.bounds).then((pois) => {
        return Object.assign(data, {pois: pois});
      });
    })
    .switchMap(data => this._poiEditorService.assignGTrackPois(data))
    .switchMap(data => this._poiEditorService.assignOrganizedPois(data))
    .map(data => {
      const _pois = this._poiEditorService.assignOnOffRoutePois(data);
      return this._hikeEditPoiActions.setGooglePois(_pois);
    });

  @Effect()
  getOsmNaturalPois$: Observable<Action> = this._actions$
    .ofType(HikeEditPoiActions.GET_OSM_NATURAL_POIS)
    .map(toPayload)
    .switchMap(data => {
      return this._osmPoiService.get(data.bounds, 'natural').then((pois) => {
        return Object.assign(data, {pois: pois});
      });
    })
    .switchMap(data => this._poiEditorService.assignGTrackPois(data))
    .switchMap(data => this._poiEditorService.assignOrganizedPois(data))
    .map(data => {
      const _pois = this._poiEditorService.assignOnOffRoutePois(data);
      return this._hikeEditPoiActions.setOsmNaturalPois(_pois);
    });

  @Effect()
  getOsmAmenityPois$: Observable<Action> = this._actions$
    .ofType(HikeEditPoiActions.GET_OSM_AMENITY_POIS)
    .map(toPayload)
    .switchMap(data => {
      return this._osmPoiService.get(data.bounds, 'amenity').then((pois) => {
        return Object.assign(data, {pois: pois});
      });
    })
    .switchMap(data => this._poiEditorService.assignGTrackPois(data))
    .switchMap(data => this._poiEditorService.assignOrganizedPois(data))
    .map(data => {
      const _pois = this._poiEditorService.assignOnOffRoutePois(data);
      return this._hikeEditPoiActions.setOsmAmenityPois(_pois);
    });

  @Effect()
  getOsmRoutePois$: Observable<Action> = this._actions$
    .ofType(HikeEditPoiActions.GET_OSM_ROUTE_POIS)
    .map(toPayload)
    .switchMap(data => {
      return this._osmRoutePoiService.get(data.bounds, data.typeParam).then((pois) => {
        return Object.assign(data, {pois: pois});
      });
    })
    .switchMap(data => this._poiEditorService.assignGTrackPois(data))
    .switchMap(data => this._poiEditorService.assignOrganizedPois(data))
    .map(data => {
      const _pois = this._poiEditorService.assignOnOffRoutePois(data);
      return this._hikeEditPoiActions.setOsmRoutePois(_pois);
    });

  @Effect()
  markersConfigChanged$: Observable<any> = this._actions$
    .ofType(HikeEditPoiActions.MARKERS_CONFIG_CHANGED)
    .map(toPayload)
    .mergeMap(data => {
      return this._store.select((state: State) => state.hikeEditMap.mapId)
        .skipWhile(mapId => mapId === null)
        .map((mapId: string) => {
          const _map: AdminMap = this._adminMapService.getMapById(mapId);
          return Object.assign(data, {map: _map});
        });
    })
    // data now containts payload + map
    .mergeMap(data => {
      return this._store.select((state: State) => state.hikeEditPoi[data.subdomain])
        .map((subdomainData) => Object.assign(data, subdomainData));
    })
    // data now containts payload + map + pois
    .mergeMap(data => {
      this._poiEditorService.handleMarkerChanged(data, data.map);
      return Observable.empty<Response>();
    });
}
