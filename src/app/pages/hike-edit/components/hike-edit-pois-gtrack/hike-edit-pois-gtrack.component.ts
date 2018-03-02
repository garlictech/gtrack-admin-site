
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { IPoi } from 'subrepos/provider-client';
import { PoiSelectors, CenterRadius, GeometryService } from 'subrepos/gtrack-common-ngx';
import { AdminMap, AdminMapService } from 'app/shared/services/admin-map';
import {
  State, hikeEditPoiActions, IExternalPoiListContextState, commonPoiActions, commonGeoSearchActions,
} from 'app/store';
import { HikeEditPoiSelectors, HikeEditMapSelectors } from 'app/store/selectors';

import * as _ from 'lodash';
import * as uuid from 'uuid/v1';

@Component({
  selector: 'gt-hike-edit-pois-gtrack',
  templateUrl: './hike-edit-pois-gtrack.component.html'
})
export class HikeEditPoisGTrackComponent implements OnInit, OnDestroy {
  public pois$: Observable<IPoi[]>;
  private _map: AdminMap;
  private _destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private _store: Store<State>,
    private _adminMapService: AdminMapService,
    private _hikeEditMapSelectors: HikeEditMapSelectors,
    private _hikeEditPoiSelectors: HikeEditPoiSelectors,
    private _geometryService: GeometryService,
    private _poiSelectors: PoiSelectors
  ) {}

  ngOnInit() {
    this._store.select(this._hikeEditMapSelectors.getHikeEditMapMapIdSelector())
      .skipWhile(id => id === '')
      .take(1)
      .subscribe((mapId: string) => {
        this._map = this._adminMapService.getMapById(mapId);
      });

    this.pois$ = this._store.select(this._hikeEditPoiSelectors.getAllGTrackPois);

    // this.markers$ = this._store.select(this._hikeEditMapSelectors.getAllGoogleMarkers);

    /*
    this.pois$
      .takeUntil(this._destroy$)
      .subscribe((pois) => {
        // Refresh markers when the poi list has been changed
        // TODO: unique gTrackPoi markers???
        /*
        this._store.dispatch(new hikeEditPoiActions.GenerateSubdomainPoiMarkers({
          subdomain: this.poiType.subdomain
        }));
        * /
      });*/
  }

  ngOnDestroy() {
    this._destroy$.next(true);
    this._destroy$.unsubscribe();
  }

  /**
   * Remove gTrack poi from list
   */
  public removePoi($event, poi) {
    // this._store.dispatch(new commonPoiActions.RemoveGTrackPoi({id: poi.id}));
  }

  /**
   * Get pois for the current subdomain
   */
  public getPois() {
    let _bounds = this._map.routeInfo.getSearchBounds();
    let _geo: CenterRadius = this._geometryService.getCenterRadius(_bounds);
    let _centerCoord = _geo!.center!.geometry!.coordinates;

    if (_centerCoord) {
      this._store.dispatch(new hikeEditPoiActions.GetGTrackPois({
        centerCoord: _centerCoord,
        radius: 1000,
        mapId: this._map.id
      }));
    }

    /*

    if (_bounds) {
      /*
      old:
      getPois: ->
        bounds = RouteService.getSearchBounds()
        _removePois()

        AsyncRequestExecutor.execute scope, PoiService.search bounds
        .then (res) ->
          pois = _.map res, (p) -> new GtrackPoiEditor p
          PoiEditorService.organizePois(pois, RouteService.getPath()).then (organizedPois) ->
            scope.pois = _.sortBy organizedPois, (p) -> p.distFromStart
            _handleHikeInclusion()
            _markerConfigChanged()

      */

  }

  /**
   * Save inHike pois as gTrackPoi
   */
  public savePois() {
    /*
    this.pois$
      .take(1)
      .subscribe((pois: IPoi[]) => {
        _.forEach(pois, (poi: IPoi) => {
          return this._store.dispatch(new commonPoiActions.CreatePoi(poi));
        })
      });
    */
  }
}
