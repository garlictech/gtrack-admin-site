import { Injectable } from '@angular/core';
import { combineLatest } from 'rxjs';
import { take, debounceTime } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { State } from '../../../store';
import { editedHikeProgramActions } from '../../../store/actions';
import * as hikeEditRoutePlannerSelectors from '../../../store/selectors/hike-edit-route-planner';
import * as editedHikeProgramSelectors from '../../../store/selectors/edited-hike-program';
import { IHikeProgramStop, IRoute } from 'subrepos/provider-client';
import { GeospatialService } from 'subrepos/gtrack-common-ngx/app/shared/services/geospatial';
import { ElevationService, GameRuleService, Route, CheckpointService } from 'subrepos/gtrack-common-ngx';

import _get from 'lodash-es/get';
import _last from 'lodash-es/last';
import _first from 'lodash-es/first';
import _cloneDeep from 'lodash-es/cloneDeep';
import _orderBy from 'lodash-es/orderBy';
import { point as turfPoint } from '@turf/helpers';
import turfLength from '@turf/length';
import turfDistance from '@turf/distance';
import { select as d3Select } from 'd3-selection';
import * as geojson2svg from 'geojson2svg';
import { IRouteTotal } from 'app/shared/interfaces';

@Injectable()
export class HikeProgramService {
  public gpxRoute: IRoute;

  constructor(
    private _store: Store<State>,
    private _geospatialService: GeospatialService,
    private _elevationService: ElevationService,
    private _gameRuleService: GameRuleService,
    private _checkpointService: CheckpointService
  ) {}

  /**
   * Update stop segments and start/end points
   */
  public updateHikeProgramStops() {
    combineLatest(
      this._store.pipe(
        select(editedHikeProgramSelectors.getStops),
        debounceTime(250),
        take(1)
      ),
      this._store.pipe(
        select(hikeEditRoutePlannerSelectors.getPath),
        debounceTime(250),
        take(1)
      )
    )
    .pipe(take(1))
    .subscribe(([stops, path]: [IHikeProgramStop[], any]) => {
      const poiStops = _cloneDeep(stops).filter(stop => !stop.poiId.includes('endpoint'));
      const reversePoiStops = _cloneDeep(poiStops);

      if (poiStops.length > 0) {
        for (const stop of poiStops) {
          this._updateStopDistanceFromOrigo(stop, path, 0);
        }

        for (const stop of reversePoiStops) {
          this._updateStopDistanceFromOrigo(stop, path, path.geometry.coordinates.length - 1);
        }

        if (path.geometry.coordinates.length > 0) {
          // Add endpoint-start
          if (poiStops[0].distanceFromOrigo > 25) {
            poiStops.unshift(this._createStopFromPathEndPoint(path, 0, false));
          }
          if (reversePoiStops[0].distanceFromOrigo > 25) {
            reversePoiStops.unshift(this._createStopFromPathEndPoint(path, path.geometry.coordinates.length - 1, true));
          }

          // Add endpoint-finish
          const distanceFromFinish = Math.round(1000 * turfDistance(
            turfPoint([_last(poiStops).lon, _last(poiStops).lat]),
            turfPoint([_last(path.geometry.coordinates)[0], _last(path.geometry.coordinates)[1]]),
            { units: 'kilometers' }
          ));
          if (path.geometry.coordinates.length > 1 && distanceFromFinish > 25) {
            poiStops.push(this._createStopFromPathEndPoint(path, path.geometry.coordinates.length - 1, false));
          }

          const reverseDistanceFromFinish = Math.round(1000 * turfDistance(
            turfPoint([_last(reversePoiStops).lon, _last(reversePoiStops).lat]),
            turfPoint([_first(path.geometry.coordinates)[0], _first(path.geometry.coordinates)[1]]),
            { units: 'kilometers' }
          ));
          if (path.geometry.coordinates.length > 1 && reverseDistanceFromFinish > 25) {
            reversePoiStops.push(this._createStopFromPathEndPoint(path, 0, true));
          }
        }
      } else {
        // Add endpoint-start
        if (path.geometry.coordinates.length > 0) {
          poiStops.unshift(this._createStopFromPathEndPoint(path, 0, false));
          reversePoiStops.unshift(this._createStopFromPathEndPoint(path, path.geometry.coordinates.length - 1, true));
        }
        // Add endpoint-finish
        if (path.geometry.coordinates.length > 1) {
          poiStops.push(this._createStopFromPathEndPoint(path, path.geometry.coordinates.length - 1, false));
          reversePoiStops.push(this._createStopFromPathEndPoint(path, 0, true));
        }
      }

      // Update segments
      this._updateStopsSegment(_orderBy(poiStops, ['distanceFromOrigo']), path, false);
      this._updateStopsSegment(_orderBy(reversePoiStops, ['distanceFromOrigo']), path, true);

      // Update total
      const total = this._calculateTotal(poiStops);
      const reverseTotal: IRouteTotal = this._calculateTotal(reversePoiStops);
      const totals = {
        ...total,
        reverseTime: reverseTotal.time,
        reverseScore: reverseTotal.score,
      };
      this._store.dispatch(new editedHikeProgramActions.AddHikeProgramDetails(totals, true));
    });
  }

  private _updateStopDistanceFromOrigo(stop: IHikeProgramStop, path: any, coordIdx: number) {
    if (path.geometry.coordinates.length > 1) {
      stop.distanceFromOrigo = this._geospatialService.distanceOnLine(
        path.geometry.coordinates[coordIdx],
        [stop.lon, stop.lat],
        path
      );
    }
  }

  /**
   * Create begin/end stop from path endpoints
   */
  private _createStopFromPathEndPoint(path: any, coordIdx: number, reverse: boolean) {
    const coord = path.geometry.coordinates[coordIdx];
    const distCoordIdx = reverse ? path.geometry.coordinates.length - 1 : 0;

    return {
      distanceFromOrigo:
        (coordIdx === 0
        ? (reverse ? this._geospatialService.distanceOnLine(path.geometry.coordinates[distCoordIdx], coord, path) : 0)
        : (reverse ? 0 : this._geospatialService.distanceOnLine(path.geometry.coordinates[distCoordIdx], coord, path))),
      onRoute: true,
      poiId: 'endpoint-' + (coordIdx === 0
        ? (reverse ? 'finish' : 'start')
        : (reverse ? 'start' : 'finish')),
      lat: coord[1],
      lon: coord[0],
      segment: {
        uphill: 0,
        downhill: 0,
        distance: 0,
        score: 0,
        time: 0
      }
    };
  }

  /**
   * Update stops' segment info
   */
  private _updateStopsSegment(stops: IHikeProgramStop[], path: any, reverse: boolean) {
    if (_get(path, 'geometry.coordinates', []).length > 0) {
      let _segmentStartPoint = reverse
        ? path.geometry.coordinates[path.geometry.coordinates.length - 1]
        : path.geometry.coordinates[0];

      for (const idx in stops) {
        if (stops[idx]) {
          const stop = stops[idx];
          const _segmentEndPoint = [stop.lon, stop.lat];
          const _segmentPath = this._geospatialService.snappedLineSlice(_segmentStartPoint, _segmentEndPoint, path);
          const _segmentDistance = 1000 * turfLength(_segmentPath, { units: 'kilometers' });

          stop.segment = {
            uphill: this._elevationService.calculateUphill((<any>_segmentPath).geometry.coordinates),
            downhill: this._elevationService.calculateDownhill((<any>_segmentPath).geometry.coordinates),
            distance: _segmentDistance
          };
          stop.segment.time = this._gameRuleService.segmentTime(
            _segmentDistance, reverse ? stop.segment.uphill : stop.segment.downhill
          ),
          stop.segment.score = this._gameRuleService.score(
            _segmentDistance, reverse ? stop.segment.uphill : stop.segment.downhill
          );

          stop.isStart = parseInt(idx, 0) === 0;
          stop.isFinish = parseInt(idx, 0) === stops.length - 1;

          // Save coords for the next segment - DEPRECATED LOGIC
          _segmentStartPoint = [stop.lon, stop.lat];
        }
      }

      if (reverse) {
        this._store.dispatch(new editedHikeProgramActions.SetReverseStops(stops));
      } else {
        this._store.dispatch(new editedHikeProgramActions.SetStops(stops));
        this._store.dispatch(new editedHikeProgramActions.SetCheckpoints(this._checkpointService.createSequence(stops)));
      }
    }
  }

  private _calculateTotal(stops: IHikeProgramStop[]) {
    const total = {};

    for (const stop of stops) {
      for (const key in stop.segment) {
        if (typeof stop.segment[key] !== 'undefined') {
          if (typeof total[key] === 'undefined') {
            total[key] = 0;
          }
          total[key] += stop.segment[key];
        }
      }
    }

    return total;
  }

  /**
   * Get current languages from descriptions
   */
  public getDescriptionLanguages() {
    let langs: string[] = [];
    this._store
      .pipe(
        select(editedHikeProgramSelectors.getDescriptionLangs),
        take(1)
      )
      .subscribe((langKeys: string[]) => {
        langs = langKeys.map(key => key.substr(0, 2));
      });

    return langs;
  }

  public createElevationIcon(_route: Route) {
    const _iconWidth = 54;
    const _iconHeight = 20;
    const _elevationData = this._elevationService.getd3ElevationData(_route, _iconWidth, _iconHeight, {
      top: 4,
      left: 4,
      right: 4,
      bottom: 4
    });

    if (_elevationData) {
      const _div: HTMLDivElement = document.createElement('div');

      d3Select(_div)
        .append('svg')
        .attr('xmlns', 'http://www.w3.org/2000/svg')
        .attr('version', '1.1')
        .attr('viewBox', `0, 0, ${_iconWidth}, ${_iconHeight}`)
        .append('svg:path')
        .attr('d', _elevationData.lineFunc(_elevationData.lineData))
        .attr('stroke', 'orange')
        .attr('stroke-width', 2)
        .attr('fill', 'none');

      return `data:image/svg+xml;utf8,${_div.innerHTML}`;
    } else {
      return '';
    }
  }

  public createRouteIcon(_route: Route) {
    const _iconWidth = 54;
    const _iconHeight = 54;

    if (_route.bounds && _route.path) {
      const _converter = geojson2svg({
        viewportSize: {
          width: _iconWidth,
          height: _iconHeight
        },
        mapExtent: {
          left: _route.bounds.SouthWest.lon,
          bottom: _route.bounds.SouthWest.lat,
          right: _route.bounds.NorthEast.lon,
          top: _route.bounds.NorthEast.lat
        },
        output: 'svg',
        fitTo: 'width',
        attributes: {
          fill: 'none',
          stroke: 'red',
          'stroke-width': 2
        }
      });

      const _svgString = _converter.convert(_route.path);
      const _p = -5; // padding; viewBox: [x, y, w, h]
      // tslint:disable:max-line-length
      return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="${_p} ${_p} ${_iconWidth -
        2 * _p} ${_iconHeight - 2 * _p}">${_svgString}</svg>`;
      // tslint:enable:max-line-length
    } else {
      return '';
    }
  }
}
