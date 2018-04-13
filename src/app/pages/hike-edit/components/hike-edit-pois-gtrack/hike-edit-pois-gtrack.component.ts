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
  IGeoSearchResponseItem
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
  selector: 'gt-hike-edit-pois-gtrack',
  templateUrl: './hike-edit-pois-gtrack.component.html'
})
export class HikeEditPoisGTrackComponent implements OnInit, OnDestroy {
  public pois$: Observable<IGTrackPoi[]>;
  public routeInfoData$: Observable<IHikeEditRoutePlannerState>;
  public searchContext$: Observable<IGeoSearchContextState | undefined>;
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

    // Get pois by id from geoSearch result
    Observable.combineLatest(
      this._store.select(this._geoSearchSelectors.getGeoSearch('gTrackPois')),
      this._store.select(this._poiSelectors.getPoiIds)
    )
      .takeUntil(this._destroy$)
      .subscribe(([searchData, inStorePoiIds]: [IGeoSearchResponseItem, string[]]) => {
        if (searchData) {
          const poiIds = _.difference(
            (<any>searchData).results,
            _.intersection((<any>searchData).results, inStorePoiIds)
          );

          // Get only the not-loaded pois
          if (poiIds && poiIds.length > 0) {
            this._store.dispatch(new commonPoiActions.LoadPois(poiIds));
          }
        }
      });

    // Poi list based on geoSearch results
    // dirty flag will change on add/remove gTrackPoi to/from the hike
    this.pois$ = Observable.combineLatest(
      this._store.select(
        this._geoSearchSelectors.getGeoSearchResults<IPoiStored>('gTrackPois', this._poiSelectors.getAllPois)
      ),
      this._store.select(this._hikeEditPoiSelectors.getHikeEditPoiContextPropertySelector('gTrack', 'dirty'))
    )
      .debounceTime(150)
      .takeUntil(this._destroy$)
      .filter(([pois, dirty]: [IGTrackPoi[] | undefined, boolean]) => typeof pois !== 'undefined')
      .switchMap(([pois, dirty]) =>
        this._store.select(this._hikeEditRoutePlannerSelectors.getPath).switchMap((path: any) => {
          return Observable.of([this._poiEditorService.organizePois(<any>_.cloneDeep(pois), path), dirty]);
        })
      )
      .switchMap(([pois, dirty]: [IGTrackPoi[], boolean]) => {
        if (dirty) {
          this._store.dispatch(new hikeEditPoiActions.SetListDirty({ subdomain: 'gTrack', dirty: false }));
        }

        return Observable.of(this._poiEditorService.handleHikeInclusion(pois));
      });

    this.pois$
      .debounceTime(150)
      .takeUntil(this._destroy$)
      .subscribe((pois: Poi[]) => {
        // Refresh markers
        this._poiEditorService.refreshPoiMarkers(this._map);
      });

    // Route info from the store (for disabling GET buttons)
    this.routeInfoData$ = this._store.select(this._hikeEditRoutePlannerSelectors.getRoutePlanner);

    //
    // Contexts
    //

    this.searchContext$ = this._store.select(this._geoSearchSelectors.getGeoSearchContext('gTrackPois'));

    this.showOnrouteMarkers$ = this._store.select(
      this._hikeEditPoiSelectors.getHikeEditPoiContextPropertySelector('gTrack', 'showOnrouteMarkers')
    );

    this.showOffrouteMarkers$ = this._store.select(
      this._hikeEditPoiSelectors.getHikeEditPoiContextPropertySelector('gTrack', 'showOffrouteMarkers')
    );

    //
    // Refresh markers
    //

    this.showOnrouteMarkers$.takeUntil(this._destroy$).subscribe(() => {
      this._poiEditorService.refreshPoiMarkers(this._map);
    });
    this.showOffrouteMarkers$.takeUntil(this._destroy$).subscribe(() => {
      this._poiEditorService.refreshPoiMarkers(this._map);
    });
  }

  ngOnDestroy() {
    this._destroy$.next(true);
    this._destroy$.unsubscribe();
  }

  /**
   * Get pois for the current subdomain
   */
  public getPois() {
    this._poiEditorService.getGTrackPois(this._map);
  }

  /**
   * Show onroute markers checkbox click
   */
  public toggleOnrouteMarkers() {
    this._store.dispatch(new hikeEditPoiActions.ToggleOnrouteMarkers({ subdomain: 'gTrack' }));
  }

  /**
   * Show offroute markers checkbox click
   */
  public toggleOffrouteMarkers() {
    this._store.dispatch(new hikeEditPoiActions.ToggleOffrouteMarkers({ subdomain: 'gTrack' }));
  }
}
