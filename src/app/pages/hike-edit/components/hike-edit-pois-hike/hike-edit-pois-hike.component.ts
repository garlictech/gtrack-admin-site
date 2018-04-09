
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import {
   PoiSelectors, CenterRadius, GeometryService, GeoSearchSelectors, Poi, PoiSaved, IGeoSearchContextState, RouteSelectors
} from 'subrepos/gtrack-common-ngx';
import { IPoiStored, IPoi } from 'subrepos/provider-client';
import { AdminMap, AdminMapService, AdminMapMarker } from 'app/shared/services/admin-map';
import { PoiEditorService } from 'app/shared/services';
import { IGTrackPoi } from 'app/shared/interfaces';
import {
  State, hikeEditPoiActions, IExternalPoiListContextState, commonPoiActions, commonGeoSearchActions, hikeEditGeneralInfoActions, IHikeEditRoutePlannerState,
} from 'app/store';
import {
  HikeEditPoiSelectors, HikeEditMapSelectors, HikeEditGeneralInfoSelectors, HikeEditRoutePlannerSelectors
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
      .takeUntil(this._destroy$)
      .filter(id => id !== '')
      .subscribe((mapId: string) => {
        this._map = this._adminMapService.getMapById(mapId);
      });

    // Get pois by id
    Observable
      .combineLatest(
        this._store.select(this._hikeEditGeneralInfoSelectors.getPois),
        this._store.select(this._poiSelectors.getPoiIds)
      )
      .takeUntil(this._destroy$)
      .debounceTime(300)
      .takeUntil(this._destroy$)
      .subscribe(([inHikePoiIds, inStorePoiIds]: [string[], string[]]) => {
        const poiIds = _.difference(inHikePoiIds, _.intersection(inHikePoiIds, inStorePoiIds))

        // Get only the not-loaded pois
        if (poiIds && poiIds.length > 0) {
          this._store.dispatch(new commonPoiActions.LoadPois(poiIds));
        }
      });

    // Poi list
    // Observable TODO getPath take(1)-el külön + toArray
    this.pois$ = Observable
      .combineLatest(
        this._store.select(this._hikeEditGeneralInfoSelectors.getHikePois<(IPoi)>(this._poiSelectors.getAllPois)),
        this._store.select(this._hikeEditRoutePlannerSelectors.getPath)
      )
      .takeUntil(this._destroy$)
      .debounceTime(300)
      .filter(([pois, path]: [Poi[], any]) => typeof pois !== 'undefined')
      .switchMap(([pois, path]: [Poi[], any]) => {
        return Observable.of(this._poiEditorService.organizePois(_.cloneDeep(pois), path));
      });

    this.pois$
      .takeUntil(this._destroy$)
      .debounceTime(300)
      .subscribe((pois: Poi[]) => {
        // Refresh markers
        this._poiEditorService.refreshPoiMarkers(this._map);
      });

    //
    // Contexts
    //

    this.showOnrouteMarkers$ = this._store
      .select(this._hikeEditPoiSelectors.getHikeEditContextPropertySelector('hike', 'showOnrouteMarkers'));

    this.showOffrouteMarkers$ = this._store
      .select(this._hikeEditPoiSelectors.getHikeEditContextPropertySelector('hike', 'showOffrouteMarkers'));

    //
    // Refresh markers
    //

    this.showOnrouteMarkers$.takeUntil(this._destroy$).subscribe(() => {
      this._poiEditorService.refreshPoiMarkers(this._map);
    });
    this.showOffrouteMarkers$.takeUntil(this._destroy$).subscribe(() => {
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
    this._store.dispatch(
      new hikeEditPoiActions.ToggleOnrouteMarkers({ subdomain: 'hike' })
    );
  }

  /**
   * Show offroute markers checkbox click
   */
  public toggleOffrouteMarkers() {
    this._store.dispatch(
      new hikeEditPoiActions.ToggleOffrouteMarkers({ subdomain: 'hike' })
    );
  }
}
