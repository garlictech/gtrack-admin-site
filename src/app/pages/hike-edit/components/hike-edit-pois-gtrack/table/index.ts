// Core
import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { State, editedHikeProgramActions, hikeEditPoiActions } from '../../../../../store';
import { Subject } from 'rxjs';
import { IGTrackPoi } from '../../../../../shared/interfaces';
import { LanguageService } from '../../../../../shared/services';
import { HikeEditRoutePlannerSelectors, HikeEditPoiSelectors } from '../../../../../store/selectors';
import { GeospatialService } from 'subrepos/gtrack-common-ngx/app/shared/services/geospatial';

@Component({
  selector: 'hike-edit-pois-gtrack-table',
  templateUrl: './ui.html'
})
export class HikeEditPoisGTrackTableComponent {
  @Input() pois$: IGTrackPoi[];
  @Input() onRouteCheck: boolean;
  @Input() openGTrackPoiModal: any;
  private _destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private _store: Store<State>,
    private _geospatialService: GeospatialService,
    private _hikeEditRoutePlannerSelectors: HikeEditRoutePlannerSelectors
  ) {}

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

  public translateDescription(description, field) {
    return LanguageService.translateDescription(description, field);
  }
}
