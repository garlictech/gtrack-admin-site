import _cloneDeep from 'lodash-es/cloneDeep';
import _filter from 'lodash-es/filter';
import _keys from 'lodash-es/keys';
import _map from 'lodash-es/map';
import _set from 'lodash-es/set';
import { combineLatest, interval, Observable, Subject } from 'rxjs';
import { debounceTime, filter, switchMap, take, takeUntil } from 'rxjs/operators';
import * as uuid from 'uuid/v1';

import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { PoiSelectors } from '@bit/garlictech.angular-features.common.poi';
import { select, Store } from '@ngrx/store';

import { ExternalPoi, FilteredProperties, GTrackPoi } from '../../../../shared/interfaces';
import { PoiEditorService, PoiMergeService } from '../../../../shared/services';
import { State } from '../../../../store';
import { commonPoiActions, hikeEditPoiActions } from '../../../../store/actions';
import * as hikeEditPoiSelectors from '../../../../store/selectors/hike-edit-poi';

@Component({
  selector: 'app-hike-edit-pois-collector',
  templateUrl: './ui.html'
})
export class HikeEditPoisCollectorComponent implements OnInit, OnDestroy {
  @Input() isPlanning$: Observable<boolean>;
  pois$: Observable<Array<any>>;
  selectedPois$: Observable<Array<any>>;
  saveablePoisCount$: Observable<number>;
  saving$: Observable<boolean>;
  showOnrouteMarkers: boolean;
  showOffrouteMarkers: boolean;
  modalPoi: any;
  displayPoiModal: boolean;
  mergeSelectionCount$: Observable<number>;
  mergeProperties: FilteredProperties;
  mergedPoiIds: Array<string>;
  mergedPoiData: any;
  displayMergeModal: boolean;
  private readonly _destroy$: Subject<boolean>;

  constructor(
    private readonly _store: Store<State>,
    private readonly _poiSelectors: PoiSelectors,
    private readonly _poiEditorService: PoiEditorService,
    private readonly _poiMergeService: PoiMergeService
  ) {
    this.showOnrouteMarkers = true;
    this.showOffrouteMarkers = true;
    this.displayPoiModal = false;
    this.displayMergeModal = false;

    this.mergeProperties = {};
    this.mergedPoiIds = [];

    this._destroy$ = new Subject<boolean>();
  }

  ngOnInit(): void {
    // Poi list from store
    this.pois$ = this._store.pipe(
      select(hikeEditPoiSelectors.getAllCollectorPois),
      takeUntil(this._destroy$)
    );

    this.selectedPois$ = this._store.pipe(
      select(hikeEditPoiSelectors.getSelectedCollectorPois()),
      takeUntil(this._destroy$)
    );

    this.saving$ = this._store.pipe(
      select(hikeEditPoiSelectors.getHikeEditPoiContextPropertySelector('collector', 'saving')),
      takeUntil(this._destroy$)
    );

    this.mergeSelectionCount$ = this._store.pipe(
      select(hikeEditPoiSelectors.getMergeSelectionsCount),
      takeUntil(this._destroy$)
    );

    // Update inGtrackDb properties after common poi list has been refreshed
    this._store
      .pipe(
        select(this._poiSelectors.getAllPois),
        debounceTime(250),
        filter((gTrackPois: Array<GTrackPoi>) => gTrackPois.length > 0),
        takeUntil(this._destroy$)
      )
      .subscribe((gTrackPois: Array<GTrackPoi>) => {
        this._store
          .pipe(
            select(hikeEditPoiSelectors.getAllCollectorPois),
            filter((collectedPois: Array<any>) => collectedPois.length > 0),
            take(1)
          )
          .subscribe((collectedPois: Array<any>) => {
            const _checkedCollectorPois: Array<any> = this._poiEditorService.handleGTrackPois(
              collectedPois,
              gTrackPois
            );
            const _removablePoiIds = _map(_checkedCollectorPois.filter(p => p.inGtrackDb), 'id');
            if (_removablePoiIds.length > 0) {
              this._store.dispatch(new hikeEditPoiActions.RemovePoisFromCollector(_removablePoiIds));
            }
          });
      });

    // Turn off saving after a not empty list becames empty
    this.saveablePoisCount$ = this._store.pipe(select(hikeEditPoiSelectors.getSaveablePoisCount('collector')));
    this.saveablePoisCount$
      .pipe(
        takeUntil(this._destroy$),
        filter(poisCount => poisCount > 0),
        switchMap(poisCount => this.saveablePoisCount$.pipe(takeUntil(this._destroy$))),
        filter(poisCount => poisCount === 0)
      )
      .subscribe(() => {
        this._store.dispatch(new hikeEditPoiActions.SetSaving('collector', false));
      });

    //
    // Refresh markers
    //

    this._store
      .pipe(
        select(hikeEditPoiSelectors.getHikeEditPoiContextPropertySelector('collector', 'showOnrouteMarkers')),
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
        select(hikeEditPoiSelectors.getHikeEditPoiContextPropertySelector('collector', 'showOffrouteMarkers')),
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
   * Show onroute markers checkbox click
   */
  toggleOnrouteMarkers(): void {
    this._store.dispatch(new hikeEditPoiActions.ToggleOnrouteMarkers('collector'));
  }

  /**
   * Show offroute markers checkbox click
   */
  toggleOffrouteMarkers(): void {
    this._store.dispatch(new hikeEditPoiActions.ToggleOffrouteMarkers('collector'));
  }

  /**
   * Start merge
   */
  mergePois(): void {
    this._store
      .pipe(
        select(hikeEditPoiSelectors.getMergeSelections),
        take(1)
      )
      .subscribe((selections: Array<string>) => {
        combineLatest(
          ...selections.map(poiId =>
            this._store.pipe(
              select(hikeEditPoiSelectors.getCollectorPoi(poiId)),
              take(1)
            )
          )
        )
          .pipe(take(1))
          .subscribe(pois => {
            this.mergeProperties = this._poiMergeService.collectFlatKeyValues(pois);
            this.mergedPoiIds = _map(pois, 'id');
            this.mergedPoiData = this._poiMergeService.createGTrackPoiFromUniqueValues(this.mergeProperties.unique);

            this._store.dispatch(new hikeEditPoiActions.ResetPoiMergeSelection());

            if (_keys(this.mergeProperties.conflicts).length > 0) {
              this.displayMergeModal = true;
            } else {
              this._saveMergedPoiData();
            }
          });
      });
  }

  /**
   * Merge modal callback
   */
  // tslint:disable-next-line:no-property-initializers
  saveMergedPoi = mergedData => {
    const _coordsArr = mergedData.coords.slice(1, -1).split(',');

    this.mergedPoiData.lat = parseFloat(_coordsArr[0]);
    this.mergedPoiData.lon = parseFloat(_coordsArr[1]);
    if (typeof _coordsArr[2] !== 'undefined') {
      this.mergedPoiData.elevation = parseFloat(_coordsArr[2]);
    }
    if (typeof _coordsArr[3] !== 'undefined') {
      this.mergedPoiData.distFromRoute = parseFloat(_coordsArr[3]);
    }
    if (typeof _coordsArr[4] !== 'undefined') {
      this.mergedPoiData.onRoute = _coordsArr[4];
    }
    delete mergedData.coords;

    for (const key in mergedData) {
      if (mergedData[key]) {
        _set(this.mergedPoiData, key, mergedData[key]);
      }
    }

    this.displayMergeModal = false;

    this._saveMergedPoiData();
  };

  /**
   * Save selected pois as gTrackPoi
   */
  savePois(): void {
    this._store.dispatch(new hikeEditPoiActions.SetSaving('collector', true));

    this.pois$.pipe(take(1)).subscribe((pois: Array<ExternalPoi>) => {
      const _externalPoisToSave = _filter(pois, (poi: ExternalPoi) => !!(poi.selected && !poi.inGtrackDb));

      return interval(50)
        .pipe(take(_externalPoisToSave.length))
        .subscribe(idx => {
          if (_externalPoisToSave[idx]) {
            const _poiData = this._poiEditorService.getDbObj(_externalPoisToSave[idx]);

            this._store.dispatch(new commonPoiActions.SavePoi(_poiData));
          }
        });
    });
  }

  /**
   * Remove selected pois from the collector
   */
  removeSelectedPois(): void {
    this.selectedPois$.pipe(take(1)).subscribe((selectedPois: Array<any>) => {
      const _removablePoiIds = _map(selectedPois, 'id');
      this._store.dispatch(new hikeEditPoiActions.RemovePoisFromCollector(_removablePoiIds));
    });
  }

  // tslint:disable-next-line:no-property-initializers
  openPoiModal = poi => {
    this.modalPoi = _cloneDeep(poi);
    this.displayPoiModal = true;
  };

  /**
   * Save the new merged poi and remove merge sources
   */
  private _saveMergedPoiData(): void {
    this.mergedPoiData.id = uuid();

    this._store.dispatch(new hikeEditPoiActions.AddPoisToCollector([this.mergedPoiData]));
    this._store.dispatch(new hikeEditPoiActions.RemovePoisFromCollector(this.mergedPoiIds));
  }
}
