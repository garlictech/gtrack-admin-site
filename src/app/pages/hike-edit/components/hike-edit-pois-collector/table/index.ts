import _map from 'lodash-es/map';
import { Observable, Subject } from 'rxjs';
import { debounceTime, take, takeUntil } from 'rxjs/operators';

// Core
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';

import { State } from '../../../../../store';
import { hikeEditPoiActions } from '../../../../../store/actions';
import * as hikeEditPoiSelectors from '../../../../../store/selectors/hike-edit-poi';

@Component({
  selector: 'app-hike-edit-pois-collector-table',
  templateUrl: './ui.html'
})
export class HikeEditPoisCollectorTableComponent implements OnInit, OnDestroy {
  @Input() pois$: Observable<Array<any>>;
  @Input() onRouteCheck: boolean;
  @Input() openPoiModal: any;
  mergeSelections: { [id: string]: boolean };
  private readonly _destroy$: Subject<boolean>;

  constructor(private readonly _store: Store<State>) {
    this.mergeSelections = {};
    this._destroy$ = new Subject<boolean>();
  }

  ngOnInit(): void {
    this._store
      .pipe(
        select(hikeEditPoiSelectors.getMergeSelections),
        debounceTime(250),
        takeUntil(this._destroy$)
      )
      .subscribe((selections: Array<string>) => {
        this.mergeSelections = {};
        selections.forEach(id => {
          this.mergeSelections[id] = true;
        });
      });
  }

  ngOnDestroy(): void {
    this._destroy$.next(true);
    this._destroy$.complete();
  }

  handlePoiSelection(poiIds): void {
    this._store.dispatch(new hikeEditPoiActions.SetCollectorPoiSelected(poiIds));
  }

  // tslint:disable-next-line:no-property-initializers
  toggleMergeSelection = (poiIds: Array<string>) => {
    const removeblePoiIds = [];
    const poiIdsToAdd = [];

    for (const poiId of poiIds) {
      if (!!this.mergeSelections[poiId]) {
        removeblePoiIds.push(poiId);
      } else {
        poiIdsToAdd.push(poiId);
      }
    }

    if (removeblePoiIds.length > 0) {
      this._store.dispatch(new hikeEditPoiActions.RemoveGTrackPoiFromMergeSelection(removeblePoiIds));
    }

    if (poiIdsToAdd.length > 0) {
      this._store.dispatch(new hikeEditPoiActions.AddGTrackPoiToMergeSelection(poiIdsToAdd));
    }
  };

  invertMerge(): void {
    this.pois$.pipe(take(1)).subscribe(pois => {
      const clickablePois = pois.filter(p => !!p.onRoute === this.onRouteCheck && !p.inGtrackDb);

      this.toggleMergeSelection(_map(clickablePois, 'id'));
    });
  }

  invertSelection(): void {
    this.pois$.pipe(take(1)).subscribe(pois => {
      const clickablePois = pois.filter(p => !!p.onRoute === this.onRouteCheck && !p.inGtrackDb);

      this.handlePoiSelection(_map(clickablePois, 'id'));
    });
  }
}
