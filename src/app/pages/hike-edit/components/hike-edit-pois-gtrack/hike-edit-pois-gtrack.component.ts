
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { IPoi } from 'subrepos/provider-client';
import { AdminMap, AdminMapService } from 'app/shared/services/admin-map';
import {
  State, hikeEditPoiActions, IExternalPoiListContextState, HikeEditPoiSelectors, HikeEditMapSelectors, commonPoiActions,
} from 'app/store';

import * as _ from 'lodash';
import { PoiSelectors } from 'subrepos/gtrack-common-ngx';

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
    private _poiSelectors: PoiSelectors
  ) {}

  ngOnInit() {
    this._store.select(this._hikeEditMapSelectors.getHikeEditMapMapIdSelector())
      .subscribe((mapId: string) => {
        this._map = this._adminMapService.getMapById(mapId);
      });

    this.pois$ = this._store.select(this._poiSelectors.getAllPois);
    // this.markers$ = this._store.select(this._hikeEditMapSelectors.getAllGoogleMarkers);

    this.pois$
      .takeUntil(this._destroy$)
      .subscribe((pois) => {
        // Refresh markers when the poi list has been changed
        // TODO: unique gTrackPoi markers???
        /*
        this._store.dispatch(new hikeEditPoiActions.GenerateSubdomainPoiMarkers({
          subdomain: this.poiType.subdomain
        }));
        */
      });
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
   * Save inHike pois as gTrackPoi
   */
  public savePois() {
    this.pois$
      .take(1)
      .subscribe((pois: IPoi[]) => {
        _.forEach(pois, (poi: IPoi) => {
          return this._store.dispatch(new commonPoiActions.CreatePoi(poi));
        })
      });
  }
}
