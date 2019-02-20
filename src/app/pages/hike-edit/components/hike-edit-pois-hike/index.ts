import _difference from 'lodash-es/difference';
import _intersection from 'lodash-es/intersection';
import _map from 'lodash-es/map';
import { combineLatest, Observable, Subject } from 'rxjs';
import { debounceTime, filter, map, switchMap, take, takeUntil } from 'rxjs/operators';
import { PoiSelectors } from 'subrepos/gtrack-common-ngx';
import { IPoiStored } from 'subrepos/provider-client';

import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';

import { IGTrackPoi } from '../../../../shared/interfaces';
import { HikeProgramService, PoiEditorService } from '../../../../shared/services';
import { State } from '../../../../store';
import { commonPoiActions, editedHikeProgramActions, hikeEditPoiActions } from '../../../../store/actions';
import * as editedHikeProgramSelectors from '../../../../store/selectors/edited-hike-program';
import * as hikeEditPoiSelectors from '../../../../store/selectors/hike-edit-poi';
import * as hikeEditRoutePlannerSelectors from '../../../../store/selectors/hike-edit-route-planner';

@Component({
  selector: 'app-hike-edit-pois-hike',
  templateUrl: './ui.html'
})
export class HikeEditPoisHikeComponent implements OnInit, OnDestroy {
  @Input() isPlanning$: Observable<boolean>;
  pois$: Observable<Array<IGTrackPoi>>;
  showOnrouteMarkers = true;
  showOffrouteMarkers = true;
  displayGTrackPoiModal = false;
  modalPoi: IGTrackPoi;
  private readonly _destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private readonly _store: Store<State>,
    private readonly _poiEditorService: PoiEditorService,
    private readonly _hikeProgramService: HikeProgramService,
    private readonly _poiSelectors: PoiSelectors
  ) {}

  ngOnInit() {
    // Get pois by id
    combineLatest(
      this._store.pipe(
        select(editedHikeProgramSelectors.getPoiIds),
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
      .subscribe(([inHikePoiIds, inStorePoiIds]: [Array<string>, Array<string>]) => {
        const missingPoiIds = _difference(inHikePoiIds, _intersection(inHikePoiIds, inStorePoiIds)).filter(
          id => !id.includes('endpoint')
        );

        // Get only the not-loaded pois
        if (missingPoiIds && missingPoiIds.length > 0) {
          this._store.dispatch(new commonPoiActions.LoadPois(missingPoiIds));
        }
      });

    // Poi list
    this.pois$ = this._store.pipe(
      select(editedHikeProgramSelectors.getHikePoisCount(this._poiSelectors.getAllPois)),
      debounceTime(250),
      // takeUntil(this._destroy$),
      // switchMap(() => this._store.pipe(
      //   select(hikeEditRoutePlannerSelectors.getIsRouting),
      //   take(1)
      // )),
      // filter((routing: boolean) => !routing),
      switchMap(() =>
        combineLatest(
          this._store.pipe(
            select(editedHikeProgramSelectors.getHikePois(this._poiSelectors.getAllPois)),
            takeUntil(this._destroy$)
          ),
          this._store.pipe(
            select(hikeEditRoutePlannerSelectors.getPath),
            takeUntil(this._destroy$)
          )
        ).pipe(
          debounceTime(250),
          filter(([pois, path]: [Array<IPoiStored>, any]) => path && path.geometry.coordinates.length > 0),
          takeUntil(this._destroy$),
          map(([pois, path]: [Array<IPoiStored>, any]) => {
            let _routing;
            this._store
              .pipe(
                select(hikeEditRoutePlannerSelectors.getIsRouting),
                take(1)
              )
              .subscribe((routing: boolean) => (_routing = routing));

            const _organizedPois = this._poiEditorService.organizePois(pois, path, _routing);
            const _poiIds = _map(pois, 'id');
            const _organizedPoiIds = _map(_organizedPois, 'id');
            const _removablePoiIds = _difference(_poiIds, _intersection(_poiIds, _organizedPoiIds));

            if (_removablePoiIds.length > 0) {
              this._store.dispatch(new editedHikeProgramActions.RemoveStopByPoiId(_removablePoiIds));
            }

            return _organizedPois;
          })
        )
      )
    );

    this.pois$
      .pipe(
        takeUntil(this._destroy$),
        debounceTime(250)
      )
      .subscribe(() => {
        // Refresh markers
        this._poiEditorService.refreshPoiMarkers();
      });

    combineLatest(
      this._store.pipe(
        select(editedHikeProgramSelectors.getStopsCount),
        takeUntil(this._destroy$)
      ),
      this._store.pipe(
        select(hikeEditRoutePlannerSelectors.getPathLength),
        takeUntil(this._destroy$)
      )
    )
      .pipe(debounceTime(500))
      .subscribe(() => {
        this._hikeProgramService.updateHikeProgramStops();
      });

    //
    // Contexts & Refresh markers
    //

    this._store
      .pipe(
        select(hikeEditPoiSelectors.getHikeEditPoiContextPropertySelector('hike', 'showOnrouteMarkers')),
        takeUntil(this._destroy$)
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
        select(hikeEditPoiSelectors.getHikeEditPoiContextPropertySelector('hike', 'showOffrouteMarkers')),
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

  ngOnDestroy() {
    this._destroy$.next(true);
    this._destroy$.complete();
  }

  /**
   * Show onroute markers checkbox click
   */
  toggleOnrouteMarkers() {
    this._store.dispatch(new hikeEditPoiActions.ToggleOnrouteMarkers('hike'));
  }

  /**
   * Show offroute markers checkbox click
   */
  toggleOffrouteMarkers() {
    this._store.dispatch(new hikeEditPoiActions.ToggleOffrouteMarkers('hike'));
  }

  openGTrackPoiModal = (poi: IGTrackPoi) => {
    this.modalPoi = poi;
    this.displayGTrackPoiModal = true;
  };

  closeModal = () => {
    delete this.modalPoi;
    this.displayGTrackPoiModal = false;
  };
}
