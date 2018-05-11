import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import {
  PoiSelectors, CenterRadius, GeometryService, GeoSearchSelectors, Poi,
  PoiSaved, IGeoSearchContextState, RouteSelectors, ElevationService, ISegment, GameRuleService
} from 'subrepos/gtrack-common-ngx';
import { GeospatialService } from 'subrepos/gtrack-common-ngx/app/shared/services/geospatial';
import { IPoiStored, IPoi, IHikeProgramStop } from 'subrepos/provider-client';
import { AdminMap, AdminMapService, AdminMapMarker } from 'app/shared/services/admin-map';
import { PoiEditorService } from 'app/shared/services';
import { IGTrackPoi } from 'app/shared/interfaces';
import {
  State, hikeEditPoiActions, IExternalPoiListContextState, commonPoiActions, commonGeoSearchActions, IHikeEditRoutePlannerState, editedHikeProgramActions
} from 'app/store';
import {
  HikeEditPoiSelectors, HikeEditMapSelectors, HikeEditRoutePlannerSelectors, EditedHikeProgramSelectors
} from 'app/store/selectors';

import * as _ from 'lodash';
import * as uuid from 'uuid/v1';
import * as turf from '@turf/turf';

@Component({
  selector: 'gt-hike-edit-pois-hike',
  templateUrl: './ui.html'
})
export class HikeEditPoisHikeComponent implements OnInit, OnDestroy {
  public pois$: Observable<IGTrackPoi[]>;
  public showOnrouteMarkers$: Observable<boolean>;
  public showOffrouteMarkers$: Observable<boolean>;
  private _map: AdminMap;
  private _destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private _store: Store<State>,
    private _adminMapService: AdminMapService,
    private _poiEditorService: PoiEditorService,
    private _editedHikeProgramSelectors: EditedHikeProgramSelectors,
    private _hikeEditMapSelectors: HikeEditMapSelectors,
    private _hikeEditPoiSelectors: HikeEditPoiSelectors,
    private _hikeEditRoutePlannerSelectors: HikeEditRoutePlannerSelectors,
    private _geoSearchSelectors: GeoSearchSelectors,
    private _geometryService: GeometryService,
    private _geospatialService: GeospatialService,
    private _elevationService: ElevationService,
    private _gameRuleService: GameRuleService,
    private _poiSelectors: PoiSelectors
  ) {}

  ngOnInit() {
    this._store
      .select(this._hikeEditMapSelectors.getMapId)
      .filter(id => id !== '')
      .takeUntil(this._destroy$)
      .subscribe((mapId: string) => {
        this._map = this._adminMapService.getMapById(mapId);
      });

    // Get pois by id
    Observable
      .combineLatest(
        this._store.select(this._editedHikeProgramSelectors.getPoiIds).takeUntil(this._destroy$),
        this._store.select(this._poiSelectors.getPoiIds).takeUntil(this._destroy$)
      )
      .debounceTime(150)
      .takeUntil(this._destroy$)
      .subscribe(([inHikePoiIds, inStorePoiIds]: [string[], string[]]) => {
        const missingPoiIds = _.difference(inHikePoiIds, _.intersection(inHikePoiIds, inStorePoiIds))

        // Get only the not-loaded pois
        if (missingPoiIds && missingPoiIds.length > 0) {
          this._store.dispatch(new commonPoiActions.LoadPois(missingPoiIds));
        }
      });

    // Poi list
    this.pois$ = this._store
      .select(this._editedHikeProgramSelectors.getHikePois<IPoiStored>(this._poiSelectors.getAllPois))
      .takeUntil(this._destroy$)
      .filter((pois: IPoiStored[]) => typeof pois !== 'undefined')
      .switchMap((pois: IPoiStored[]) => {
        return this._store
          .select(this._hikeEditRoutePlannerSelectors.getPath)
          .filter((path: any) => path && path.geometry.coordinates.length > 0)
          .takeUntil(this._destroy$)
          .map((path: any) => {
            return this._poiEditorService.organizePois(pois, path);
          });
      });

    this.pois$
      .debounceTime(150)
      .takeUntil(this._destroy$)
      .subscribe((pois: IGTrackPoi[]) => {
        // Refresh markers
        this._poiEditorService.refreshPoiMarkers(this._map);
      });

    this._store
      .select(this._editedHikeProgramSelectors.getStopsCount)
      .takeUntil(this._destroy$)
      .subscribe((stopsCount: number) => {
        if (stopsCount > 0) {
          this._store
            .select(this._editedHikeProgramSelectors.getStops)
            .take(1)
            .subscribe((stops: IHikeProgramStop[]) => {
              this._updateStopsSegment(_.orderBy(_.cloneDeep(stops), ['distanceFromOrigo']));
            });
        }
      });

    //
    // Contexts
    //

    this.showOnrouteMarkers$ = this._store
      .select(this._hikeEditPoiSelectors.getHikeEditPoiContextPropertySelector('hike', 'showOnrouteMarkers'))
      .takeUntil(this._destroy$);

    this.showOffrouteMarkers$ = this._store
      .select(this._hikeEditPoiSelectors.getHikeEditPoiContextPropertySelector('hike', 'showOffrouteMarkers'))
      .takeUntil(this._destroy$);

    //
    // Refresh markers
    //

    this.showOnrouteMarkers$
      .takeUntil(this._destroy$)
      .subscribe(() => {
        this._poiEditorService.refreshPoiMarkers(this._map);
      });

    this.showOffrouteMarkers$
      .takeUntil(this._destroy$)
      .subscribe(() => {
        this._poiEditorService.refreshPoiMarkers(this._map);
      });
  }

  ngOnDestroy() {
    this._destroy$.next(true);
    this._destroy$.unsubscribe();
  }

  /**
   * Show onroute markers checkbox click
   */
  public toggleOnrouteMarkers() {
    this._store.dispatch(new hikeEditPoiActions.ToggleOnrouteMarkers({ subdomain: 'hike' }));
  }

  /**
   * Show offroute markers checkbox click
   */
  public toggleOffrouteMarkers() {
    this._store.dispatch(new hikeEditPoiActions.ToggleOffrouteMarkers({ subdomain: 'hike' }));
  }

  /**
   * Update stops' segment info
   */
  private _updateStopsSegment(stops: IHikeProgramStop[]) {
    this._store
      .select(this._hikeEditRoutePlannerSelectors.getPath)
      .take(1)
      .subscribe(path => {
        if (path.geometry.coordinates.length > 0) {
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
      });
  }
}
