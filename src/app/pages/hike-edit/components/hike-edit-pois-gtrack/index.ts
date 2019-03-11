import _difference from 'lodash-es/difference';
import _intersection from 'lodash-es/intersection';
import { combineLatest, Observable, of, Subject } from 'rxjs';
import { debounceTime, filter, switchMap, take, takeUntil } from 'rxjs/operators';
import {
  GeoSearchContextState,
  GeoSearchResponseItem,
  GeoSearchSelectors,
  PoiSelectors
} from 'subrepos/gtrack-common-ngx';

import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { PoiStored } from '@bit/garlictech.angular-features.common.gtrack-interfaces';
import { select, Store } from '@ngrx/store';

import { GTrackPoi } from '../../../../shared/interfaces';
import { PoiEditorService } from '../../../../shared/services';
import { State } from '../../../../store';
import { commonPoiActions, hikeEditPoiActions } from '../../../../store/actions';
import * as editedHikeProgramSelectors from '../../../../store/selectors/edited-hike-program';
import * as hikeEditPoiSelectors from '../../../../store/selectors/hike-edit-poi';
import * as hikeEditRoutePlannerSelectors from '../../../../store/selectors/hike-edit-route-planner';

@Component({
  selector: 'app-hike-edit-pois-gtrack',
  templateUrl: './ui.html'
})
export class HikeEditPoisGTrackComponent implements OnInit, OnDestroy {
  @Input() isPlanning$: Observable<boolean>;
  pois$: Observable<Array<GTrackPoi>>;
  segments$: Observable<any>;
  searchContext$: Observable<GeoSearchContextState | undefined>;
  showOnrouteMarkers: boolean;
  showOffrouteMarkers: boolean;
  displayGTrackPoiModal: boolean;
  modalPoi: GTrackPoi;
  private readonly _destroy$: Subject<boolean>;

  constructor(
    private readonly _store: Store<State>,
    private readonly _poiEditorService: PoiEditorService,
    private readonly _geoSearchSelectors: GeoSearchSelectors,
    private readonly _poiSelectors: PoiSelectors
  ) {
    this.showOnrouteMarkers = true;
    this.showOffrouteMarkers = true;
    this.displayGTrackPoiModal = false;

    this._destroy$ = new Subject<boolean>();
  }

  ngOnInit(): void {
    // Get pois by id from geoSearch result
    combineLatest(
      this._store.pipe(
        select(this._geoSearchSelectors.getGeoSearch('gTrackPois')),
        takeUntil(this._destroy$)
      ),
      this._store.pipe(
        select(this._poiSelectors.getPoiIds),
        takeUntil(this._destroy$)
      )
    )
      .pipe(
        debounceTime(250),
        takeUntil(this._destroy$)
      )
      .subscribe(([searchData, inStorePoiIds]: [GeoSearchResponseItem, Array<string>]) => {
        if (searchData) {
          const missingPoiIds = _difference(
            (searchData as any).results,
            _intersection((searchData as any).results, inStorePoiIds)
          );

          // Get only the not-loaded pois
          if (missingPoiIds && missingPoiIds.length > 0) {
            this._store.dispatch(new commonPoiActions.LoadPois(missingPoiIds));
          }
        }
      });

    // Poi list based on geoSearch results
    // dirty flag will change on add/remove gTrackPoi to/from the hike
    this.pois$ = combineLatest(
      this._store.pipe(
        select(this._poiSelectors.getAllPoisCount()),
        takeUntil(this._destroy$)
      ),
      this._store.pipe(
        select(editedHikeProgramSelectors.getStopsCount),
        takeUntil(this._destroy$)
      )
    ).pipe(
      filter(([poiCount, stopsCount]: [number, number]) => poiCount > 0),
      debounceTime(250),
      switchMap(([poiCount, stopsCount]: [number, number]) =>
        this._store.pipe(
          select(this._geoSearchSelectors.getGeoSearchResults<PoiStored>('gTrackPois', this._poiSelectors.getAllPois)),
          takeUntil(this._destroy$)
        )
      ),
      switchMap((pois: Array<PoiStored>) =>
        this._store.pipe(
          select(hikeEditRoutePlannerSelectors.getPath),
          debounceTime(250),
          takeUntil(this._destroy$),
          switchMap((path: any) => of([path, this._poiEditorService.organizePois(pois, path)])),
          switchMap(([path, organizedPois]: [any, Array<GTrackPoi>]) =>
            of([path, this._poiEditorService.handleHikeInclusion(organizedPois)])
          ),
          switchMap(([path, organizedPois]: [any, Array<GTrackPoi>]) =>
            of(this._poiEditorService.getGTrackPoiDistanceFromOrigo(organizedPois, path))
          )
        )
      )
    );

    this.pois$
      .pipe(
        takeUntil(this._destroy$),
        debounceTime(250)
      )
      .subscribe((pois: Array<GTrackPoi>) => {
        // Refresh markers
        this._poiEditorService.refreshPoiMarkers();
      });

    // Route info from the store (for disabling GET buttons)
    this.segments$ = this._store.pipe(
      select(hikeEditRoutePlannerSelectors.getSegments),
      takeUntil(this._destroy$)
    );

    //
    // Contexts
    //

    this.searchContext$ = this._store.pipe(
      select(this._geoSearchSelectors.getGeoSearchContext('gTrackPois')),
      takeUntil(this._destroy$)
    );

    //
    // Refresh markers
    //

    this._store
      .pipe(
        select(hikeEditPoiSelectors.getHikeEditPoiContextPropertySelector('gTrack', 'showOnrouteMarkers')),
        takeUntil(this._destroy$),
        debounceTime(250)
      )
      .subscribe((value: boolean) => {
        this.showOnrouteMarkers = value;
        this.isPlanning$.pipe(take(1)).subscribe((isPlanning: boolean) => {
          if (isPlanning) {
            this._poiEditorService.refreshPoiMarkers();
          }
        });
      });

    this._store
      .pipe(
        select(hikeEditPoiSelectors.getHikeEditPoiContextPropertySelector('gTrack', 'showOffrouteMarkers')),
        takeUntil(this._destroy$),
        debounceTime(250)
      )
      .subscribe((value: boolean) => {
        this.showOffrouteMarkers = value;
        this.isPlanning$.pipe(take(1)).subscribe((isPlanning: boolean) => {
          if (isPlanning) {
            this._poiEditorService.refreshPoiMarkers();
          }
        });
      });
  }

  ngOnDestroy(): void {
    this._destroy$.next(true);
    this._destroy$.complete();
  }

  /**
   * Get pois for the current subdomain
   */
  getPois(): void {
    this._poiEditorService.getGTrackPois();
  }

  /**
   * Show onroute markers checkbox click
   */
  toggleOnrouteMarkers(): void {
    this._store.dispatch(new hikeEditPoiActions.ToggleOnrouteMarkers('gTrack'));
  }

  /**
   * Show offroute markers checkbox click
   */
  toggleOffrouteMarkers(): void {
    this._store.dispatch(new hikeEditPoiActions.ToggleOffrouteMarkers('gTrack'));
  }

  // tslint:disable-next-line:no-property-initializers
  openGTrackPoiModal = (poi: GTrackPoi) => {
    this.modalPoi = poi;
    this.displayGTrackPoiModal = true;
  };

  // tslint:disable-next-line:no-property-initializers
  closeModal = () => {
    delete this.modalPoi;
    this.displayGTrackPoiModal = false;
  };
}
