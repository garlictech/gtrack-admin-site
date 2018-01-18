
import { Component, Input, Injector, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { AdminMap, AdminMapService } from 'app/shared/services/admin-map';
import { OsmPoiService } from 'app/shared/services';
import { IExternalPoiType, IExternalPoi } from 'app/shared/interfaces';
import {
  State,
  hikeEditPoiActions,
  selectHikeEditPoiListContext,
  poiSelectors,
  /*
  selectHikeEditDomainPois,
  selectHikeEditDomainLoading,
  selectHikeEditDomainOnrouteMarkers,
  selectHikeEditDomainOffrouteMarkers,
  */
  selectHikeEditMapMapId
} from 'app/store';
import { ExternalPoi } from 'app/shared/services/poi/external-poi';
import * as _ from 'lodash';
import { IExternalPoiListContextState } from 'app/store/state';

@Component({
  selector: 'gt-hike-edit-pois-external',
  templateUrl: './hike-edit-pois-external.component.html',
  providers: [OsmPoiService]
})
export class HikeEditPoisExternalComponent implements OnInit, OnDestroy {
  @Input() poiType: IExternalPoiType;
  public pois$: Observable<any>;
  public poiListContext$: Observable<IExternalPoiListContextState>;
  private _map: AdminMap;
  private _destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private _injector: Injector,
    private _store: Store<State>,
    private _adminMapService: AdminMapService,
  ) {}

  ngOnInit() {
    console.log('poiType', this.poiType);

    // TODO: refactor to use entities
    this.pois$ = this._store.select(poiSelectors[this.poiType.subdomain].all);
    this.poiListContext$ = this._store.select(selectHikeEditPoiListContext[this.poiType.subdomain]);
    /*

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
      */

    this._store.select(selectHikeEditMapMapId)
      .subscribe((mapId: string) => {
        console.log('mapId', mapId, this.poiType);
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
   * _removePois submethod
   */
  private _firstToLowerCase(str: string) {
    return str.substr(0, 1).toLowerCase() + str.substr(1);
  }

  public savePois() {
    //
  }
}
