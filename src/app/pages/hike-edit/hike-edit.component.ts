import * as L from 'leaflet';
import _pick from 'lodash-es/pick';
import { MessageService } from 'primeng/api';
import { combineLatest, Observable, Subject } from 'rxjs';
import { delay, filter, skipWhile, switchMap, take, takeUntil } from 'rxjs/operators';
import { HikeSelectors, IHikeContextState, RouteSelectors } from 'subrepos/gtrack-common-ngx';
import { BackgroundImageData, EObjectState, IHikeProgramStored, IRoute } from 'subrepos/provider-client';
import * as uuid from 'uuid/v1';

import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { LeafletMapService } from '@common.features/leaflet-map/services/leaflet-map.service';
import { leafletMapActions } from '@common.features/leaflet-map/store';
import { createSelector, MemoizedSelector, select, Store } from '@ngrx/store';

import { HikeProgramService } from '../../shared/services';
import { RoutePlannerService, WaypointMarkerService } from '../../shared/services/admin-map';
import { HikeEditRoutePlannerState, State } from '../../store';
import {
  commonHikeActions,
  commonPoiActions,
  commonRouteActions,
  editedHikeProgramActions,
  hikeEditImageActions,
  hikeEditRoutePlannerActions
} from '../../store/actions';
import * as editedHikeProgramSelectors from '../../store/selectors/edited-hike-program';
import * as hikeEditRoutePlannerSelectors from '../../store/selectors/hike-edit-route-planner';

@Component({
  selector: 'app-hike-edit',
  templateUrl: './hike-edit.component.html',
  styleUrls: ['./hike-edit.component.scss']
})
export class HikeEditComponent implements OnInit, OnDestroy, AfterViewInit {
  hikeProgramState$: Observable<EObjectState>;
  hikeProgramData$: Observable<IHikeProgramStored>;
  allowSave$: Observable<boolean>;
  isPlanning$: Observable<boolean>;
  working$: Observable<string | null>;
  EObjectState = EObjectState;
  paramsId: string;
  backgroundImageUrlSelector: MemoizedSelector<object, Array<string>>;
  backgroundImageSelector: MemoizedSelector<object, Array<BackgroundImageData>>;
  clickActions: any;
  displayPreview = false;
  private _hikeId: string;
  private readonly _destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private readonly _store: Store<State>,
    private readonly _changeDetectorRef: ChangeDetectorRef,
    private readonly _activatedRoute: ActivatedRoute,
    private readonly _leafletMapService: LeafletMapService,
    private readonly _waypointMarkerService: WaypointMarkerService,
    private readonly _routePlannerService: RoutePlannerService,
    private readonly _hikeProgramService: HikeProgramService,
    private readonly _hikeSelectors: HikeSelectors,
    private readonly _routeSelectors: RouteSelectors,
    private readonly _messageService: MessageService,
    private readonly _router: Router,
    private readonly _title: Title
  ) {}

  ngOnInit() {
    this.working$ = this._store.pipe(
      select(editedHikeProgramSelectors.getWorking),
      takeUntil(this._destroy$)
    );
    this.hikeProgramData$ = this._store.pipe(
      select(editedHikeProgramSelectors.getData),
      delay(0),
      takeUntil(this._destroy$)
    );

    this._waypointMarkerService.reset();

    this._store.dispatch(new leafletMapActions.ResetMap());
    this._store.dispatch(new hikeEditImageActions.ResetImageState());
    this._store.dispatch(new hikeEditRoutePlannerActions.ResetRoutePlanningState());
    this._store.dispatch(new editedHikeProgramActions.ResetHikeProgram());

    this._activatedRoute.params.pipe(takeUntil(this._destroy$)).subscribe(params => {
      // Edit existing hike
      if (params && params.id) {
        this.paramsId = params.id;

        // Set page title
        this._title.setTitle('Edit hike');

        // Set hike id and load hikeProgram data
        this._store.dispatch(new editedHikeProgramActions.AddHikeProgramDetails({ id: this.paramsId }, false));
        this._store.dispatch(new commonHikeActions.LoadHikeProgram(params.id));

        // Disable planning
        this._store.dispatch(new hikeEditRoutePlannerActions.SetPlanning(false));
        // Create new hike
      } else {
        // Set page title
        this._title.setTitle('New hike');

        // Generate initial hike id and load the empty hikeProgram (for save toaster handling)
        this._hikeId = uuid();
        this._store.dispatch(new editedHikeProgramActions.AddHikeProgramDetails({ id: this._hikeId }, false));
        // this._store.dispatch(new commonHikeActions.HikeProgramUnsaved(_hikeId));

        // Generate initial route id and load the empty route (for save toaster handling)
        const _routeId = uuid();
        this._store.dispatch(new editedHikeProgramActions.AddHikeProgramDetails({ routeId: _routeId }, false));
        // Update the routes's dirty flag
        this._store.dispatch(new commonRouteActions.RouteModified(_routeId));

        // Create initial language block
        this._store.dispatch(
          new editedHikeProgramActions.AddNewTranslatedHikeProgramDescription('en_US', {
            title: `Test hike #${new Date().getTime()}`,
            fullDescription: 'desc',
            summary: 'summary'
          })
        );

        // Draw an independent path to the map
        if (typeof this._hikeProgramService.gpxRoute !== 'undefined') {
          this._parseGpxRoute();
        }
      }
    });

    this.allowSave$ = this._store.pipe(
      select(editedHikeProgramSelectors.getDirty),
      takeUntil(this._destroy$)
    );

    this.isPlanning$ = this._store.pipe(
      select(hikeEditRoutePlannerSelectors.getIsPlanning),
      takeUntil(this._destroy$)
    );

    // Handling save success
    this._store
      .pipe(
        select(editedHikeProgramSelectors.getWorking),
        takeUntil(this._destroy$),
        filter(working => working !== null),
        switchMap(() =>
          this._store.pipe(
            select(editedHikeProgramSelectors.getWorking),
            takeUntil(this._destroy$)
          )
        ),
        filter(working => working === null),
        switchMap(() =>
          this._store.pipe(
            select(editedHikeProgramSelectors.getError),
            take(1)
          )
        ),
        takeUntil(this._destroy$)
      )
      .subscribe((error: any) => {
        if (error) {
          const msg: Array<string> = [];
          for (const idx in error) {
            if (error[idx]) {
              msg.push(`${idx}: ${error[idx]}`);
            }
          }

          this._messageService.add({
            severity: 'error',
            summary: 'Hike',
            detail: `Error:\n${msg.join('\n')}`,
            life: 8000
          });
        } else {
          this._messageService.add({
            severity: 'success',
            summary: 'Hike',
            detail: 'Success!'
          });

          // Load the hike page if it's a new hike
          if (!this.paramsId) {
            this._router.navigate([`/admin/hike/${this._hikeId}`]);
          } else {
            // Disable planning
            this._store.dispatch(new hikeEditRoutePlannerActions.SetPlanning(false));
          }
        }
      });

    this.hikeProgramState$ = this._store.pipe(
      select(editedHikeProgramSelectors.getState),
      takeUntil(this._destroy$)
    );

    // Handling hike context changes
    this._store
      .pipe(
        select(editedHikeProgramSelectors.getHikeId),
        takeUntil(this._destroy$),
        filter(hikeId => hikeId !== ''),
        switchMap((hikeId: string) =>
          this._store.pipe(
            select(this._hikeSelectors.getHikeContext(hikeId)),
            takeUntil(this._destroy$)
          )
        ),
        filter(hikeContext => !!hikeContext)
      )
      .subscribe((hikeContext: IHikeContextState) => {
        if (hikeContext.loaded) {
          this._store
            .pipe(
              select(this._hikeSelectors.getHike(hikeContext.id)),
              take(1)
            )
            .subscribe((hikeData: IHikeProgramStored) => {
              // Add the whole data to store
              this._store.dispatch(new editedHikeProgramActions.AddHikeProgramDetails(hikeData, false));

              // Load route
              this._store.dispatch(new commonRouteActions.LoadRoute(hikeData.routeId));
            });
        }
      });

    // Attributes for Photos component
    this.backgroundImageSelector = editedHikeProgramSelectors.getBackgroundImages;
    this.backgroundImageUrlSelector = editedHikeProgramSelectors.getBackgroundOriginalUrls();

    this.clickActions = {
      add: image => this._store.dispatch(new editedHikeProgramActions.AddHikeProgramBackgroundImage(image)),
      remove: url => this._store.dispatch(new editedHikeProgramActions.RemoveHikeProgramBackgroundImage(url)),
      addMarker: image => this._store.dispatch(new hikeEditImageActions.AddImageMarker(image)),
      addMarkers: images => this._store.dispatch(new hikeEditImageActions.AddImageMarkers(images)),
      removeMarker: image => this._store.dispatch(new hikeEditImageActions.RemoveImageMarker(image)),
      removeMarkers: images => this._store.dispatch(new hikeEditImageActions.RemoveImageMarkers(images))
    };
  }

  ngAfterViewInit() {
    this._changeDetectorRef.detectChanges();
  }

  ngOnDestroy() {
    this._destroy$.next(true);
    this._destroy$.complete();
  }

  saveHike() {
    // Save hikeProgram
    this._store.dispatch(new editedHikeProgramActions.SaveHikeProgram());

    // Save route
    combineLatest(
      this._store.pipe(
        select(hikeEditRoutePlannerSelectors.getRoutePlanner),
        take(1)
      ),
      this._store.pipe(
        select(editedHikeProgramSelectors.getRouteId),
        take(1)
      )
    ).subscribe(([routePlannerState, routeId]: [HikeEditRoutePlannerState, string]) => {
      if (routePlannerState && routeId) {
        const _route: IRoute = {
          id: routeId,
          bounds: (routePlannerState.route as any).bounds,
          route: _pick(routePlannerState.route, ['type', 'features'])
        };
        this._store.dispatch(new commonRouteActions.SaveRoute(_route));
      }
    });
  }

  updateHikeState(hikeProgramState: EObjectState) {
    this._store.dispatch(new commonHikeActions.UpdateHikeProgramState(this.paramsId, hikeProgramState));

    if (hikeProgramState === EObjectState.published) {
      const selector = createSelector(
        editedHikeProgramSelectors.getStops,
        editedHikeProgramSelectors.getRouteId,
        (stops, routeId) => ({
          stops,
          routeId
        })
      );

      // Publish the related objects
      this.hikeProgramState$
        .pipe(
          skipWhile((hikeState: EObjectState) => hikeState !== EObjectState.published),
          take(1),
          switchMap(() =>
            this._store.pipe(
              select(selector),
              take(1)
            )
          )
        )
        .subscribe(data => {
          const stops = data.stops;
          const routeId = data.routeId;

          // Publish pois
          for (const stop of stops) {
            if (!stop.poiId.includes('endpoint')) {
              this._store.dispatch(new commonPoiActions.UpdatePoiState(stop.poiId, EObjectState.published));
            }
          }

          // Publish the route
          this._store.dispatch(new commonRouteActions.UpdateRouteState(routeId, EObjectState.published));
        });
    }
  }

  openPreview() {
    this.displayPreview = true;
  }

  handleHikeProgramFeature() {
    this.hikeProgramData$.pipe(take(1)).subscribe((hikeProgramData: IHikeProgramStored) => {
      this._store.dispatch(
        new editedHikeProgramActions.AddHikeProgramDetails({ feature: !hikeProgramData.feature }, true)
      );
    });
  }

  retrievePlan() {
    this._store
      .pipe(
        select(editedHikeProgramSelectors.getRouteId),
        switchMap((routeId: string) =>
          this._store.pipe(
            select(this._routeSelectors.getRoute(routeId)),
            take(1)
          )
        ),
        take(1)
      )
      .subscribe((storedRoute: any) => {
        this._waypointMarkerService.reset();

        const _coords: Array<L.LatLng> = [];

        for (const feature of storedRoute.route.features) {
          if (feature.geometry.type === 'Point') {
            _coords.push(L.latLng(feature.geometry.coordinates[1], feature.geometry.coordinates[0]));
          }
        }

        this._waypointMarkerService.addWaypoints(_coords);

        // Enable planning
        this._store.dispatch(new hikeEditRoutePlannerActions.SetPlanning(true));
      });
  }

  private _parseGpxRoute() {
    this._routePlannerService.drawRouteLineGeoJSON(this._hikeProgramService.gpxRoute.route.features[0]);

    // Load path to routePlanner state - necessary for drawing pois
    this._routePlannerService.addRouteToTheStore(this._hikeProgramService.gpxRoute.route);

    const bounds: L.LatLngBoundsExpression = [
      [this._hikeProgramService.gpxRoute.bounds.NorthEast.lat, this._hikeProgramService.gpxRoute.bounds.NorthEast.lon],
      [this._hikeProgramService.gpxRoute.bounds.SouthWest.lat, this._hikeProgramService.gpxRoute.bounds.SouthWest.lon]
    ];

    this._leafletMapService.fitBounds(bounds);

    delete this._hikeProgramService.gpxRoute;
  }
}
