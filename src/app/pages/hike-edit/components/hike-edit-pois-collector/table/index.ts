// Core
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { State, editedHikeProgramActions, hikeEditPoiActions } from 'app/store';
import { Subject } from 'rxjs';
import { LanguageService } from '../../../../../shared/services';
import { HikeEditPoiSelectors } from '../../../../../store/selectors';

@Component({
  selector: 'hike-edit-pois-collector-table',
  templateUrl: './ui.html'
})
export class HikeEditPoisCollectorTableComponent implements OnInit, OnDestroy {
  @Input() pois$: any[];
  @Input() onRouteCheck: boolean;
  @Input() openPoiModal: any;
  public mergeSelections: {[id: string]: boolean} = {}
  private _destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private _store: Store<State>,
    private _hikeEditPoiSelectors: HikeEditPoiSelectors,
  ) {}

  ngOnInit() {
    this._store
      .select(this._hikeEditPoiSelectors.getMergeSelections)
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

  public handlePoiSelection(poi) {
    this._store.dispatch(new hikeEditPoiActions.SetCollectorPoiSelected(poi.id, !poi.selected));
  }

  public toggleMergeSelection(poiId: string) {
    if (!this.mergeSelections[poiId]) {
      this._store.dispatch(new hikeEditPoiActions.RemoveGTrackPoiFromMergeSelection(poiId));
    } else {
      this._store.dispatch(new hikeEditPoiActions.AddGTrackPoiToMergeSelection(poiId));
    }
  }

  public translateDescription(description, field) {
    return LanguageService.translateDescription(description, field);
  }
}
