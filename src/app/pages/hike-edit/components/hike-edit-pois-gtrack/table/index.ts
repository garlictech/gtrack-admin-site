// Core
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { State, editedHikeProgramActions, hikeEditPoiActions } from 'app/store';
import { Subject } from 'rxjs';
import { IGTrackPoi } from 'app/shared/interfaces';
import { LanguageService } from 'app/shared/services';
import { HikeEditRoutePlannerSelectors, HikeEditPoiSelectors } from 'app/store/selectors';
import { GeospatialService } from 'subrepos/gtrack-common-ngx/app/shared/services/geospatial';

@Component({
  selector: 'hike-edit-pois-gtrack-table',
  templateUrl: './ui.html'
})
export class HikeEditPoisGTrackTableComponent implements OnInit, OnDestroy {
  @Input() pois$: IGTrackPoi[];
  @Input() onRouteCheck: boolean;
  @Input() openGTrackPoiModal: any;
  public mergeSelections: {[id: string]: boolean} = {}
  private _destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private _store: Store<State>,
    private _geospatialService: GeospatialService,
    private _hikeEditRoutePlannerSelectors: HikeEditRoutePlannerSelectors,
    private _hikeEditPoiSelectors: HikeEditPoiSelectors,
  ) {}

  ngOnInit() {
    // this.mergeSelection$ =
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

  public addPoi($event, poi: IGTrackPoi) {
    $event.stopPropagation();

    this._store
      .select(this._hikeEditRoutePlannerSelectors.getPath)
      .take(1)
      .subscribe((path) => {
        const stop = {
          distanceFromOrigo: this._geospatialService.distanceOnLine(
            path.geometry.coordinates[0],
            [poi.lon, poi.lat],
            path
          ),
          onRoute: poi.onRoute || false,
          poiId: poi.id,
          lat: poi.lat,
          lon: poi.lon,
          // Segment data will be calculated after inserting the stop
          segment: {
            uphill: 0,
            downhill: 0,
            distance: 0,
            score: 0,
            time: 0
          }
        }

        this._store.dispatch(new editedHikeProgramActions.AddStop(stop));
      });
  }

  ngOnDestroy() {
    this._destroy$.next(true);
    this._destroy$.unsubscribe();
  }

  public translateDescription(description, field) {
    return LanguageService.translateDescription(description, field);
  }

  public toggleMergeSelection(poiId: string) {
    if (!this.mergeSelections[poiId]) {
      this._store.dispatch(new hikeEditPoiActions.RemoveGTrackPoiFromMergeSelection(poiId));
    } else {
      this._store.dispatch(new hikeEditPoiActions.AddGTrackPoiToMergeSelection(poiId));
    }
  }
}
