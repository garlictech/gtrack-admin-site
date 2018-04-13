import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import {
  PoiSelectors,
  CenterRadius,
  GeometryService,
  GeoSearchSelectors,
  Poi,
  PoiSaved,
  IGeoSearchContextState,
  RouteSelectors
} from 'subrepos/gtrack-common-ngx';
import { IPoiStored, IPoi } from 'subrepos/provider-client';
import { AdminMap, AdminMapService, AdminMapMarker } from 'app/shared/services/admin-map';
import { PoiEditorService } from 'app/shared/services';
import { IGTrackPoi } from 'app/shared/interfaces';
import {
  State,
  hikeEditPoiActions,
  IExternalPoiListContextState,
  commonPoiActions,
  commonGeoSearchActions,
  hikeEditGeneralInfoActions,
  IHikeEditRoutePlannerState
} from 'app/store';
import {
  HikeEditPoiSelectors,
  HikeEditMapSelectors,
  HikeEditGeneralInfoSelectors,
  HikeEditRoutePlannerSelectors
} from 'app/store/selectors';

import * as _ from 'lodash';
import * as uuid from 'uuid/v1';

@Component({
  selector: 'gt-hike-edit-pois-hike',
  templateUrl: './hike-edit-pois-hike.component.html'
})
export class HikeEditPoisHikeComponent implements OnInit, OnDestroy {
  public pois$: Observable<IGTrackPoi[]>;
  public showOnrouteMarkers$: Observable<boolean>;
  public showOffrouteMarkers$: Observable<boolean>;
  private _map: AdminMap;
  private _destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private _store: Store<State>,
    private _adminMapService: AdminMapService,
    private _poiEditorService: PoiEditorService,
    private _hikeEditMapSelectors: HikeEditMapSelectors,
    private _hikeEditPoiSelectors: HikeEditPoiSelectors,
    private _hikeEditGeneralInfoSelectors: HikeEditGeneralInfoSelectors,
    private _hikeEditRoutePlannerSelectors: HikeEditRoutePlannerSelectors,
    private _geoSearchSelectors: GeoSearchSelectors,
    private _geometryService: GeometryService,
    private _poiSelectors: PoiSelectors
  ) {}

  ngOnInit() {
    this._store
      .select(this._hikeEditMapSelectors.getMapId)
      .filter(id => id !== '')
      .takeUntil(this._destroy$)
      .subscribe((mapId: string) => {
        this._map = this._adminMapService.getMapById(mapId);
      });

    // Get pois by id
    Observable
      .combineLatest(
        this._store.select(this._hikeEditGeneralInfoSelectors.getPois).takeUntil(this._destroy$),
        this._store.select(this._poiSelectors.getPoiIds).takeUntil(this._destroy$)
      )
      .debounceTime(150)
      .takeUntil(this._destroy$)
      .subscribe(([inHikePoiIds, inStorePoiIds]: [string[], string[]]) => {
        const missingPoiIds = _.difference(inHikePoiIds, _.intersection(inHikePoiIds, inStorePoiIds))

        // Get only the not-loaded pois
        if (missingPoiIds && missingPoiIds.length > 0) {
          this._store.dispatch(new commonPoiActions.LoadPois(missingPoiIds));
        }
      });

    // Poi list
    this.pois$ = this._store

      .select(this._hikeEditGeneralInfoSelectors.getHikePois<IPoiStored>(this._poiSelectors.getAllPois))
      .takeUntil(this._destroy$)
      .filter((pois: IPoiStored[]) => typeof pois !== 'undefined')
      .switchMap((pois: IPoiStored[]) => {
        return this._store
          .select(this._hikeEditRoutePlannerSelectors.getPath)
          .filter((path: any) => path && path.geometry.coordinates.length > 0)
          .takeUntil(this._destroy$)
          .map((path: any) => {
            return this._poiEditorService.organizePois(_.cloneDeep(pois), path);
          });
      });

    this.pois$
      .debounceTime(150)
      .takeUntil(this._destroy$)
      .subscribe((pois: Poi[]) => {
        // Refresh markers
        this._poiEditorService.refreshPoiMarkers(this._map);
      });

    //
    // Contexts
    //

    this.showOnrouteMarkers$ = this._store
      .select(this._hikeEditPoiSelectors.getHikeEditPoiContextPropertySelector('hike', 'showOnrouteMarkers'))
      .takeUntil(this._destroy$);

    this.showOffrouteMarkers$ = this._store
      .select(this._hikeEditPoiSelectors.getHikeEditPoiContextPropertySelector('hike', 'showOffrouteMarkers'))
      .takeUntil(this._destroy$);

    //
    // Refresh markers
    //

    this.showOnrouteMarkers$
      .takeUntil(this._destroy$)
      .subscribe(() => {
        this._poiEditorService.refreshPoiMarkers(this._map);
      });

    this.showOffrouteMarkers$
      .takeUntil(this._destroy$)
      .subscribe(() => {
        this._poiEditorService.refreshPoiMarkers(this._map);
      });
  }

  ngOnDestroy() {
    this._destroy$.next(true);
    this._destroy$.unsubscribe();
  }

  /**
   * Show onroute markers checkbox click
   */
  public toggleOnrouteMarkers() {
    this._store.dispatch(new hikeEditPoiActions.ToggleOnrouteMarkers({ subdomain: 'hike' }));
  }

  /**
   * Show offroute markers checkbox click
   */
  public toggleOffrouteMarkers() {
    this._store.dispatch(new hikeEditPoiActions.ToggleOffrouteMarkers({ subdomain: 'hike' }));
  }
}
