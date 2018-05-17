import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { State, editedHikeProgramActions } from 'app/store';
import { EditedHikeProgramSelectors, HikeEditRoutePlannerSelectors } from 'app/store/selectors';
import { IHikeProgramStop } from 'subrepos/provider-client';
import { GeospatialService } from 'subrepos/gtrack-common-ngx/app/shared/services/geospatial';
import { ElevationService, GameRuleService } from 'subrepos/gtrack-common-ngx';

import * as _ from 'lodash';
import * as turf from '@turf/turf';

@Injectable()
export class HikeProgramService {
  constructor(
    private _store: Store<State>,
    private _geospatialService: GeospatialService,
    private _elevationService: ElevationService,
    private _gameRuleService: GameRuleService,
    private _editedHikeProgramSelectors: EditedHikeProgramSelectors,
    private _hikeEditRoutePlannerSelectors: HikeEditRoutePlannerSelectors,
  ) {}

  /**
   * Update stop segments and start/end points
   */
  public updateHikeProgramStops() {
    Observable
      .combineLatest(
        this._store.select(this._editedHikeProgramSelectors.getStops).take(1),
        this._store.select(this._hikeEditRoutePlannerSelectors.getPath).take(1)
      )
      .take(1)
      .subscribe(([stops, path]: [IHikeProgramStop[], any]) => {
        const poiStops = _.cloneDeep(stops).filter(stop => stop.poiId !== 'endpoint');

        console.log('poiStops', poiStops);
        if (path.geometry.coordinates.length > 0) {
          poiStops.unshift(this._createStopFromPathEndPoint(path, 0));
          poiStops.push(this._createStopFromPathEndPoint(path, path.geometry.coordinates.length - 1));
        }
        this._updateStopsSegment(_.orderBy(poiStops, ['distanceFromOrigo']), path);
      });
  }

  /**
   * Create begin/end stop from path endpoints
   */
  private _createStopFromPathEndPoint(path, coordIdx) {
    const coord = path.geometry.coordinates[coordIdx];
    return {
      distanceFromOrigo: coord === 0 ? 0 : this._geospatialService.distanceOnLine(
        path.geometry.coordinates[0],
        coord,
        path
      ),
      onRoute: true,
      poiId: 'endpoint',
      lat: coord[1],
      lon: coord[0],
      segment: {
        uphill: 0,
        downhill: 0,
        distance: 0,
        score: 0,
        time: 0
      }
    }
  }

  /**
   * Update stops' segment info
   */
  private _updateStopsSegment(stops: IHikeProgramStop[], path: any) {
    if (_.get(path, 'geometry.coordinates', []).length > 0) {
      let _segmentStartPoint =  path.geometry.coordinates[0];

      for (const stop of stops) {
        const _segmentEndPoint = [stop.lon, stop.lat];
        const _segmentPath = this._geospatialService.snappedLineSlice(_segmentStartPoint, _segmentEndPoint, path);
        const _segmentDistance = 1000 * turf.lineDistance(_segmentPath, {units: 'kilometers'});

        stop.segment = {
          uphill: this._elevationService.calculateUphill((<any>_segmentPath).geometry.coordinates),
          downhill: this._elevationService.calculateDownhill((<any>_segmentPath).geometry.coordinates),
          distance: _segmentDistance
        }
        stop.segment.time = this._gameRuleService.segmentTime(_segmentDistance, stop.segment.uphill),
        stop.segment.score = this._gameRuleService.score(_segmentDistance, stop.segment.uphill)

        // Save coords for the next segment
        _segmentStartPoint = [stop.lon, stop.lat];
      }

      this._store.dispatch(new editedHikeProgramActions.SetStops(stops));
    }
  }
}
