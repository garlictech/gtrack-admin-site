
import { Component, Input, Injector, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { AdminMap, AdminMapService } from '../../../../shared/services/admin-map';
import { OsmPoiService } from '../../../../shared/services';
import { IExternalPoiType, IExternalPoi } from '../../../../shared/interfaces';
import { State } from '../../../../store';
import { HikeEditPoiActions } from '../../../../store/hike-edit-poi/index';
import * as _ from 'lodash';
import { ExternalPoi } from '../../../../shared/services/poi/external-poi';

@Component({
  selector: 'gt-hike-edit-pois-external',
  templateUrl: './hike-edit-pois-external.component.html',
  providers: [OsmPoiService]
})
export class HikeEditPoisExternalComponent implements OnInit, OnDestroy {
  @Input() poiType: IExternalPoiType;
  public pois$: Observable<IExternalPoi>;
  public loading$: Observable<boolean>;
  public showOnrouteMarkers$: Observable<boolean>;
  public showOffrouteMarkers$: Observable<boolean>;
  private _map: AdminMap;
  private _destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private _injector: Injector,
    private _store: Store<State>,
    private _adminMapService: AdminMapService,
    private _hikeEditPoiActions: HikeEditPoiActions
  ) {}

  ngOnInit() {
    this.pois$ = this._store
      .select((state: State) => state.hikeEditPoi[this.poiType.subdomain].pois);
    this.loading$ = this._store
      .select((state: State) => state.hikeEditPoi[this.poiType.subdomain].loading);
    this.showOnrouteMarkers$ = this._store
      .select((state: State) => state.hikeEditPoi[this.poiType.subdomain].showOnrouteMarkers);
    this.showOffrouteMarkers$ = this._store
      .select((state: State) => state.hikeEditPoi[this.poiType.subdomain].showOffrouteMarkers);

    this.pois$
      .takeUntil(this._destroy$)
      .subscribe(() => {
        this._store.dispatch(this._hikeEditPoiActions.markersConfigChanged(this.poiType.subdomain));
      });

    this.showOnrouteMarkers$
      .takeUntil(this._destroy$)
      .subscribe(() => {
        this._store.dispatch(this._hikeEditPoiActions.markersConfigChanged(this.poiType.subdomain));
      });

    this.showOffrouteMarkers$
      .takeUntil(this._destroy$)
      .subscribe(() => {
        this._store.dispatch(this._hikeEditPoiActions.markersConfigChanged(this.poiType.subdomain));
      });

    this._store
      .select((state: State) => state.hikeEditMap.mapId)
      .skipWhile(mapId => mapId === null)
      .take(1)
      .subscribe((mapId: string) => {
        this._map = this._adminMapService.getMapById(mapId);
      });
  }

  ngOnDestroy() {
    this._destroy$.next(true);
    this._destroy$.unsubscribe();
  }

  public getPois() {
    let _bounds = this._map.routeInfo.getSearchBounds();

    if (_bounds) {
      // Clear poi list from the current subdomain
      this._removeSubdomainPois();

      // Get pois for the current domain
      this._store.dispatch(this._hikeEditPoiActions[this.poiType.getAction](
        _bounds,
        this._map.id
      ));
    }
  }

  public toggleOnrouteMarkers() {
    this._store.dispatch(this._hikeEditPoiActions.toggleOnrouteMarkers(
      this.poiType.subdomain
    ));
  }

  public toggleOffrouteMarkers() {
    this._store.dispatch(this._hikeEditPoiActions.toggleOffrouteMarkers(
      this.poiType.subdomain
    ));
  }

  /**
   * getPois submethod
   */
  private _removeSubdomainPois() {
    this._store.select((state: State) => state.hikeEditPoi[this.poiType.subdomain].pois)
      .take(1)
      .subscribe((pois) => {
        this._store.dispatch(this._hikeEditPoiActions[this.poiType.setAction]([]));
      });
  }

  /**
   * _removePois submethod
   */
  private _firstToLowerCase(str: string) {
    return str.substr(0, 1).toLowerCase() + str.substr(1);
  }

  public savePois() {
    //
  }
}
