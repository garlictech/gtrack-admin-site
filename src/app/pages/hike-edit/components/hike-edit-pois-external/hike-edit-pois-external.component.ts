
import { Component, Input, Injector, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { AdminMap, AdminMapService } from 'app/shared/services/admin-map';
import { OsmPoiService } from 'app/shared/services';
import { IExternalPoiType, IExternalPoi, IWikipediaPoi, IGooglePoi, IOsmPoi } from 'app/shared/interfaces';
import {
  State, hikeEditPoiActions, IExternalPoiListContextState,
  // Selectors
  selectHikeEditMapMapId, selectAllWikipediaPois, selectAllGooglePois, selectAllOsmAmenityPois, selectAllOsmNaturalPois, selectAllOsmRoutePois, getHikeEditContextSelector
} from 'app/store';
import { ExternalPoi } from 'app/shared/services/poi/external-poi';
import * as _ from 'lodash';

@Component({
  selector: 'gt-hike-edit-pois-external',
  templateUrl: './hike-edit-pois-external.component.html',
  providers: [OsmPoiService]
})
export class HikeEditPoisExternalComponent implements OnInit, OnDestroy {
  @Input() poiType: IExternalPoiType;
  public pois$: Observable<IWikipediaPoi[] | IGooglePoi[] | IOsmPoi[]>;
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
    switch (this.poiType.subdomain) {
      case 'google':
        this.pois$ = this._store.select(selectAllGooglePois); break;
      case 'wikipedia':
        this.pois$ = this._store.select(selectAllWikipediaPois); break;
      case 'osmAmenity':
        this.pois$ = this._store.select(selectAllOsmAmenityPois); break;
      case 'osmNatural':
        this.pois$ = this._store.select(selectAllOsmNaturalPois); break;
      case 'osmRoute':
        this.pois$ = this._store.select(selectAllOsmRoutePois); break;
    }
    this.pois$
      .takeUntil(this._destroy$)
      .subscribe(() => {
        this._store.dispatch(new hikeEditPoiActions.MarkersConfigChanged({
          subdomain: this.poiType.subdomain
        }));
      });

    this._store.select(selectHikeEditMapMapId)
      .subscribe((mapId: string) => {
        this._map = this._adminMapService.getMapById(mapId);
      });

    this.loading$ = this._store.select(
      getHikeEditContextSelector(this.poiType.subdomain, 'loading')
    );

    this.showOffrouteMarkers$ = this._store.select(
      getHikeEditContextSelector(this.poiType.subdomain, 'showOffrouteMarkers')
    );
    this.showOnrouteMarkers$
      .takeUntil(this._destroy$)
      .subscribe(() => {
        this._store.dispatch(new hikeEditPoiActions.MarkersConfigChanged({
          subdomain: this.poiType.subdomain
        }));
      });

    this.showOnrouteMarkers$ = this._store.select(
      getHikeEditContextSelector(this.poiType.subdomain, 'showOnrouteMarkers')
    );
    this.showOffrouteMarkers$
      .takeUntil(this._destroy$)
      .subscribe(() => {
        this._store.dispatch(new hikeEditPoiActions.MarkersConfigChanged({
          subdomain: this.poiType.subdomain
        }));
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
