
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { AdminMap, AdminMapService } from 'app/shared/services/admin-map';
import { IGTrackPoi } from 'app/shared/interfaces';
import {
  State, hikeEditPoiActions, IExternalPoiListContextState, HikeEditPoiSelectors, HikeEditMapSelectors, commonPoiActions,
} from 'app/store';

import * as _ from 'lodash';

@Component({
  selector: 'gt-hike-edit-pois-gtrack',
  templateUrl: './hike-edit-pois-gtrack.component.html'
})
export class HikeEditPoisGTrackComponent implements OnInit, OnDestroy {
  public pois$: Observable<IGTrackPoi[]>;
  private _map: AdminMap;
  private _destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private _store: Store<State>,
    private _adminMapService: AdminMapService,
    private _hikeEditMapSelectors: HikeEditMapSelectors,
    private _hikeEditPoiSelectors: HikeEditPoiSelectors
  ) {}

  ngOnInit() {
    this._store.select(this._hikeEditMapSelectors.getHikeEditMapMapIdSelector())
      .subscribe((mapId: string) => {
        this._map = this._adminMapService.getMapById(mapId);
      });

    this.pois$ = this._store.select(this._hikeEditPoiSelectors.getAllGTrackPois);
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
    this._store.dispatch(new hikeEditPoiActions.RemoveGTrackPoi({id: poi.id}));
  }

  /**
   * Save inHike pois as gTrackPoi
   */
  public savePois() {
    this.pois$
      .take(1)
      .subscribe((pois: IGTrackPoi[]) => {
        _.forEach(pois, (poi: IGTrackPoi) => {
          return this._store.dispatch(new commonPoiActions.CreatePoi(poi));
        })
      });
  }
}
