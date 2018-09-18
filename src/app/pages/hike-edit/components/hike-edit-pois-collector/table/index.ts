// Core
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '../../../../../store';
import { hikeEditPoiActions } from '../../../../../store/actions';
import { Observable, Subject } from 'rxjs';
import { HikeEditPoiSelectors } from '../../../../../store/selectors';

import _map from 'lodash-es/map';

@Component({
  selector: 'app-hike-edit-pois-collector-table',
  templateUrl: './ui.html'
})
export class HikeEditPoisCollectorTableComponent implements OnInit, OnDestroy {
  @Input() pois$: Observable<any[]>;
  @Input() onRouteCheck: boolean;
  @Input() openPoiModal: any;
  public mergeSelections: {[id: string]: boolean} = {};
  private _destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private _store: Store<State>,
    private _hikeEditPoiSelectors: HikeEditPoiSelectors,
  ) {}

  ngOnInit() {
    this._store
      .select(this._hikeEditPoiSelectors.getMergeSelections)
      .debounceTime(200)
      .takeUntil(this._destroy$)
      .subscribe((selections: string[]) => {
        this.mergeSelections = {};
        selections.map(id => {
          this.mergeSelections[id] = true;
        });
      });
  }

  ngOnDestroy() {
    this._destroy$.next(true);
    this._destroy$.unsubscribe();
  }

  public handlePoiSelection(poiIds) {
    this._store.dispatch(new hikeEditPoiActions.SetCollectorPoiSelected(poiIds));
  }

  public toggleMergeSelection = (poiIds: string[]) => {
    const removeblePoiIds = [];
    const poiIdsToAdd = [];

    for (const poiId of poiIds) {
      if (!!this.mergeSelections[poiId]) {
        removeblePoiIds.push(poiId);
      } else {
        poiIdsToAdd.push(poiId);
      }
    }

    if (removeblePoiIds.length > 0) {
      this._store.dispatch(new hikeEditPoiActions.RemoveGTrackPoiFromMergeSelection(removeblePoiIds));
    }

    if (poiIdsToAdd.length > 0) {
      this._store.dispatch(new hikeEditPoiActions.AddGTrackPoiToMergeSelection(poiIdsToAdd));
    }
  }

  public invertMerge() {
    this.pois$
      .take(1)
      .subscribe(pois => {
        const clickablePois = pois.filter(p => {
          return !!p.onRoute === this.onRouteCheck && !p.inGtrackDb;
        });

        this.toggleMergeSelection(_map(clickablePois, 'id'));
      });
  }

  public invertSelection() {
    this.pois$
      .take(1)
      .subscribe(pois => {
        const clickablePois = pois.filter(p => {
          return !!p.onRoute === this.onRouteCheck && !p.inGtrackDb;
        });

        this.handlePoiSelection(_map(clickablePois, 'id'));
      });
  }
}
