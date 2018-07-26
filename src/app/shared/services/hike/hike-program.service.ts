import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { State, editedHikeProgramActions } from '../../../store';
import { EditedHikeProgramSelectors, HikeEditRoutePlannerSelectors } from '../../../store/selectors';
import { IHikeProgramStop, IRoute } from 'subrepos/provider-client';
import { GeospatialService } from 'subrepos/gtrack-common-ngx/app/shared/services/geospatial';
import { ElevationService, GameRuleService, Route, RouteService } from 'subrepos/gtrack-common-ngx';

import * as _ from 'lodash';
import * as turf from '@turf/turf';
import * as d3 from 'd3';
import * as geojson2svg from 'geojson2svg';

@Injectable()
export class HikeProgramService {
  public gpxRoute: IRoute;

  constructor(
    private _store: Store<State>,
    private _geospatialService: GeospatialService,
    private _elevationService: ElevationService,
    private _gameRuleService: GameRuleService,
    private _routeService: RouteService,
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

  /**
   * Get current languages from descriptions
   */
  public getDescriptionLaguages() {
    let langs: string[] = [];
    this._store
      .select(this._editedHikeProgramSelectors.getDescriptionLangs)
      .take(1)
      .subscribe((langKeys: string[]) => {
        langs = langKeys.map(key => key.substr(0, 2));
      });

    return langs;
  }

  public createElevationIcon(_route: Route) {
    const _iconWidth = 54;
    const _iconHeight = 20;
    const _elevationData = this._routeService.elevationData(_route, _iconWidth, _iconHeight, {
      top: 2,
      left: 2,
      right: 2,
      bottom: 2
    });

    if (_elevationData) {
      const _div: HTMLDivElement = document.createElement('div');

      d3.select(_div)
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
      return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="-2 -2 ${_iconWidth + 2} ${_iconHeight + 2}">${_svgString}</svg>`;
    } else {
      return '';
    }
  }
}
