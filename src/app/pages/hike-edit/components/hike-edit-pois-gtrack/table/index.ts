// Core
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { State, editedHikeProgramActions, hikeEditPoiActions } from 'app/store';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { IGTrackPoi } from 'app/shared/interfaces';
import { LanguageService } from 'app/shared/services';
import { IDynamicComponentModalConfig, DynamicModalService } from 'subrepos/gtrack-common-ngx';
import { HikeEditRoutePlannerSelectors, HikeEditPoiSelectors } from '../../../../../store/selectors';
import { GeospatialService } from 'subrepos/gtrack-common-ngx/app/shared/services/geospatial';

@Component({
  selector: 'hike-edit-pois-gtrack-table',
  templateUrl: './ui.html'
})
export class HikeEditPoisGTrackTableComponent implements OnInit, OnDestroy {
  @Input() pois$: IGTrackPoi[];
  @Input() onRouteCheck: boolean;
  public mergeSelection$: Observable<string[]>;
  private _destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private _store: Store<State>,
    private _dynamicModalService: DynamicModalService,
    private _geospatialService: GeospatialService,
    private _hikeEditRoutePlannerSelectors: HikeEditRoutePlannerSelectors,
    private _hikeEditPoiSelectors: HikeEditPoiSelectors,
  ) {}

  ngOnInit() {
    this.mergeSelection$ = this._store
      .select(this._hikeEditPoiSelectors.getMergeSelections)
      .takeUntil(this._destroy$);
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

  public openModal($event, poi: IGTrackPoi) {
    $event.stopPropagation();

    const modalConfig: IDynamicComponentModalConfig = {
      component: {
        contentComponentName: 'HikeEditGTrackPoiInfoComponent',
        data: {
          poiId: <string>poi.id
        }
      },
      modal: {
        title: LanguageService.translateDescription(poi.description, 'title'),
        className: 'modal-lg',
        hasFooter: false
      }
    };
    this._dynamicModalService.showComponentModal(modalConfig);
  }

  public translateDescription(description, field) {
    return LanguageService.translateDescription(description, field);
  }

  public toggleMergeSelection(poiId: string) {
    this.mergeSelection$
      .take(1)
      .subscribe((mergeSelection: string[]) => {
        const _idx = mergeSelection.indexOf(poiId);
        if (_idx >= 0) {
          this._store.dispatch(new hikeEditPoiActions.RemoveGTrackPoiFromMergeSelection(poiId));
        } else {
          this._store.dispatch(new hikeEditPoiActions.AddGTrackPoiToMergeSelection(poiId));
        }
      });
  }
}
