import { Injectable } from '@angular/core';
import { Actions, Effect, toPayload } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Rx';
import { State } from '../index';
import { HikeEditPoiActions } from './index';
import {
  OsmPoiService,
  OsmRoutePoiService,
  WikipediaPoiService,
  PoiEditorService,
  GooglePoiService,
  AdminMapService
} from '../../shared/services';
import { PoiService } from '../../../subrepos/gtrack-common-ngx/index';
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
    private _poiService: PoiService,
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
    .switchMap(data => {
      return this._poiService.search(data.bounds).map((gtrackPois) => {
        return Object.assign(data, {gtrackPois: gtrackPois});
      });
    })
    .switchMap(data => {
      const _map: AdminMap = this._adminMapService.getMapById(data.mapId);
      return this._poiEditorService
        .organizePois(data.pois, _map.routeInfo.getPath(), data.gtrackPois)
        .then((organizedPois) => {
          return Object.assign(data, {organizedPois: organizedPois});
        });
    })
    .map(data => {
      let _pois = _.sortBy(data.organizedPois, (p: ExternalPoi) => p.distFromRoute);
      let _onRoutePois = this._poiEditorService.getOnroutePois(_pois);
      let _offRoutePois = this._poiEditorService.getOffroutePois(_pois);
      _.forEach(_onRoutePois, (p) => (<any>p).inHike = true);
      _.forEach(_offRoutePois, (p) => (<any>p).inHike = false);

      return this._hikeEditPoiActions.setWikipediaPois(_pois);
    });

  @Effect()
  getGooglePois$: Observable<any> = this._actions$
    .ofType(HikeEditPoiActions.GET_GOOGLE_POIS)
    .map(toPayload)
    .switchMap(data => {
      console.log('GOOGLE EFFECT data', data);

      return this._googlePoiService.get(data.bounds).then((pois) => {
        return Object.assign(data, {pois: pois});
      });
    })
    .switchMap(data => {
      return this._poiService.search(data.bounds).map((gtrackPois) => {
        return Object.assign(data, {gtrackPois: gtrackPois});
      });
    })
    .switchMap(data => {
      const _map: AdminMap = this._adminMapService.getMapById(data.mapId);
      return this._poiEditorService
        .organizePois(data.pois, _map.routeInfo.getPath(), data.gtrackPois)
        .then((organizedPois) => {
          return Object.assign(data, {organizedPois: organizedPois});
        });
    })
    .map(data => {
      let _pois = _.sortBy(data.organizedPois, (p: ExternalPoi) => p.distFromRoute);
      let _onRoutePois = this._poiEditorService.getOnroutePois(_pois);
      let _offRoutePois = this._poiEditorService.getOffroutePois(_pois);
      _.forEach(_onRoutePois, (p) => (<any>p).inHike = true);
      _.forEach(_offRoutePois, (p) => (<any>p).inHike = false);

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
    .switchMap(data => {
      return this._poiService.search(data.bounds).map((gtrackPois) => {
        return Object.assign(data, {gtrackPois: gtrackPois});
      });
    })
    .switchMap(data => {
      const _map: AdminMap = this._adminMapService.getMapById(data.mapId);
      return this._poiEditorService
        .organizePois(data.pois, _map.routeInfo.getPath(), data.gtrackPois)
        .then((organizedPois) => {
          return Object.assign(data, {organizedPois: organizedPois});
        });
    })
    .map(data => {
      let _pois = _.sortBy(data.organizedPois, (p: ExternalPoi) => p.distFromRoute);
      let _onRoutePois = this._poiEditorService.getOnroutePois(_pois);
      let _offRoutePois = this._poiEditorService.getOffroutePois(_pois);
      _.forEach(_onRoutePois, (p) => (<any>p).inHike = true);
      _.forEach(_offRoutePois, (p) => (<any>p).inHike = false);

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
    .switchMap(data => {
      return this._poiService.search(data.bounds).map((gtrackPois) => {
        return Object.assign(data, {gtrackPois: gtrackPois});
      });
    })
    .switchMap(data => {
      const _map: AdminMap = this._adminMapService.getMapById(data.mapId);
      return this._poiEditorService
        .organizePois(data.pois, _map.routeInfo.getPath(), data.gtrackPois)
        .then((organizedPois) => {
          return Object.assign(data, {organizedPois: organizedPois});
        });
    })
    .map(data => {
      let _pois = _.sortBy(data.organizedPois, (p: ExternalPoi) => p.distFromRoute);
      let _onRoutePois = this._poiEditorService.getOnroutePois(_pois);
      let _offRoutePois = this._poiEditorService.getOffroutePois(_pois);
      _.forEach(_onRoutePois, (p) => (<any>p).inHike = true);
      _.forEach(_offRoutePois, (p) => (<any>p).inHike = false);

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
    .switchMap(data => {
      return this._poiService.search(data.bounds).map((gtrackPois) => {
        return Object.assign(data, {gtrackPois: gtrackPois});
      });
    })
    .switchMap(data => {
      const _map: AdminMap = this._adminMapService.getMapById(data.mapId);
      return this._poiEditorService
        .organizePois(data.pois, _map.routeInfo.getPath(), data.gtrackPois)
        .then((organizedPois) => {
          return Object.assign(data, {organizedPois: organizedPois});
        });
    })
    .map(data => {
      let _pois = _.sortBy(data.organizedPois, (p: ExternalPoi) => p.distFromRoute);
      let _onRoutePois = this._poiEditorService.getOnroutePois(_pois);
      let _offRoutePois = this._poiEditorService.getOffroutePois(_pois);
      _.forEach(_onRoutePois, (p) => (<any>p).inHike = true);
      _.forEach(_offRoutePois, (p) => (<any>p).inHike = false);

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
        .map((subdomainData) => {
          return Object.assign(data, subdomainData);
        });
    })
    // data now containts payload + map + pois
    .mergeMap(data => {
      this._poiEditorService.handleMarkerChanged(data, data.map);
      return Observable.empty<Response>();
    });
}
