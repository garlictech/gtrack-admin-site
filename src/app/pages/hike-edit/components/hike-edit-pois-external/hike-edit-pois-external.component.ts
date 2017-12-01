
import { Component, Input, Injector, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { AdminMap, AdminMapService } from '../../../../shared/services/admin-map';
import { OsmPoiService } from '../../../../shared/services';
import { IExternalPoiType, IExternalPoi } from '../../../../shared/interfaces';
import {
  State,
  hikeEditPoiActions,
  selectHikeEditDomainPois,
  selectHikeEditDomainLoading,
  selectHikeEditDomainOnrouteMarkers,
  selectHikeEditDomainOffrouteMarkers,
  selectHikeEditMapMapId
} from '../../../../store';
import { ExternalPoi } from '../../../../shared/services/poi/external-poi';
import * as _ from 'lodash';

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
  ) {}

  ngOnInit() {
    // TODO: refactor to use entities
    this.pois$ = this._store.select(selectHikeEditDomainPois[this.poiType.subdomain]);
    this.loading$ = this._store.select(selectHikeEditDomainLoading[this.poiType.subdomain]);
    this.showOnrouteMarkers$ = this._store.select(selectHikeEditDomainOnrouteMarkers[this.poiType.subdomain]);
    this.showOffrouteMarkers$ = this._store.select(selectHikeEditDomainOffrouteMarkers[this.poiType.subdomain]);

    this.pois$
      .takeUntil(this._destroy$)
      .subscribe(() => {
        this._store.dispatch(new hikeEditPoiActions.MarkersConfigChanged({
          subdomain: this.poiType.subdomain
        }));
      });

    this.showOnrouteMarkers$
      .takeUntil(this._destroy$)
      .subscribe(() => {
        this._store.dispatch(new hikeEditPoiActions.MarkersConfigChanged({
          subdomain: this.poiType.subdomain
        }));
      });

    this.showOffrouteMarkers$
      .takeUntil(this._destroy$)
      .subscribe(() => {
        this._store.dispatch(new hikeEditPoiActions.MarkersConfigChanged({
          subdomain: this.poiType.subdomain
        }));
      });

    this._store.select(selectHikeEditMapMapId).subscribe((mapId: string) => {
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
      this._store.dispatch(new hikeEditPoiActions[this.poiType.getAction]({
        bounds: _bounds,
        mapId: this._map.id
      }));
    }
  }

  public toggleOnrouteMarkers() {
    this._store.dispatch(new hikeEditPoiActions.ToggleOnrouteMarkers({
      subdomain: this.poiType.subdomain
    }));
  }

  public toggleOffrouteMarkers() {
    this._store.dispatch(new hikeEditPoiActions.ToggleOffrouteMarkers({
      subdomain: this.poiType.subdomain
    }));
  }

  /**
   * getPois submethod
   */
  private _removeSubdomainPois() {
    this._store.select((state: State) => state.hikeEditPoi[this.poiType.subdomain].pois)
      .take(1)
      .subscribe((pois) => {
        this._store.dispatch(new hikeEditPoiActions[this.poiType.setAction]({
          pois: []
        }));
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
