import { Component, OnInit, OnDestroy, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject, combineLatest } from 'rxjs';
import { takeUntil, filter, switchMap, take, skipWhile, delay } from 'rxjs/operators';
import { Store, MemoizedSelector, createSelector, select } from '@ngrx/store';
import { State, IHikeEditRoutePlannerState } from '../../store';
import {
  commonRouteActions,
  commonHikeActions,
  hikeEditMapActions,
  editedHikeProgramActions,
  commonPoiActions,
  hikeEditImageActions
} from '../../store/actions';
import { hikeEditRoutePlannerActions } from '../../store/actions';
import { HikeEditRoutePlannerSelectors, EditedHikeProgramSelectors, HikeEditMapSelectors } from '../../store/selectors';
import { WaypointMarkerService, RoutePlannerService, AdminMapService } from '../../shared/services/admin-map';
import { IHikeProgramStored, IRoute, EObjectState, IBackgroundImageData } from 'subrepos/provider-client';
import { HikeSelectors, IHikeContextState, RouteSelectors } from 'subrepos/gtrack-common-ngx';
import { HikeProgramService } from '../../shared/services';
import { MessageService } from 'primeng/api';

import * as L from 'leaflet';
import * as uuid from 'uuid/v1';
import _pick from 'lodash-es/pick';

@Component({
  selector: 'app-hike-edit',
  templateUrl: './hike-edit.component.html',
  styleUrls: ['./hike-edit.component.scss']
})
export class HikeEditComponent implements OnInit, OnDestroy, AfterViewInit {
  public hikeProgramState$: Observable<EObjectState>;
  public hikeProgramData$: Observable<IHikeProgramStored>;
  public allowSave$: Observable<boolean>;
  public isPlanning$: Observable<boolean>;
  public working$: Observable<string | null>;
  public EObjectState = EObjectState;
  public paramsId: string;
  public backgroundImageUrlSelector: MemoizedSelector<object, string[]>;
  public backgroundImageSelector: MemoizedSelector<object, IBackgroundImageData[]>;
  public clickActions: any;
  public displayPreview = false;
  private _hikeId: string;
  private _destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private _store: Store<State>,
    private _changeDetectorRef: ChangeDetectorRef,
    private _activatedRoute: ActivatedRoute,
    private _adminMapService: AdminMapService,
    private _waypointMarkerService: WaypointMarkerService,
    private _routePlannerService: RoutePlannerService,
    private _hikeProgramService: HikeProgramService,
    private _hikeSelectors: HikeSelectors,
    private _hikeEditRoutePlannerSelectors: HikeEditRoutePlannerSelectors,
    private _hikeEditMapSelectors: HikeEditMapSelectors,
    private _editedHikeProgramSelectors: EditedHikeProgramSelectors,
    private _routeSelectors: RouteSelectors,
    private _messageService: MessageService,
    private _router: Router,
    private _title: Title
  ) {}

  ngOnInit() {
    this.working$ = this._store.pipe(
      select(this._editedHikeProgramSelectors.getWorking),
      takeUntil(this._destroy$)
    );
    this.hikeProgramData$ = this._store.pipe(
      select(this._editedHikeProgramSelectors.getData),
      delay(0),
      takeUntil(this._destroy$)
    );

    this._waypointMarkerService.reset();

    this._store.dispatch(new hikeEditMapActions.ResetMapState());
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
      select(this._editedHikeProgramSelectors.getDirty),
      takeUntil(this._destroy$)
    );

    this.isPlanning$ = this._store.pipe(
      select(this._hikeEditRoutePlannerSelectors.getIsPlanning),
      takeUntil(this._destroy$)
    );

    // Handling save success
    this._store
      .pipe(
        select(this._editedHikeProgramSelectors.getWorking),
        takeUntil(this._destroy$),
        filter(working => working !== null),
        switchMap(() =>
          this._store.pipe(
            select(this._editedHikeProgramSelectors.getWorking),
            takeUntil(this._destroy$)
          )
        ),
        filter(working => working === null),
        switchMap(() =>
          this._store.pipe(
            select(this._editedHikeProgramSelectors.getError),
            take(1)
          )
        ),
        takeUntil(this._destroy$)
      )
      .subscribe(error => {
        if (error) {
          const msg: string[] = [];
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
      select(this._editedHikeProgramSelectors.getState),
      takeUntil(this._destroy$)
    );

    // Handling hike context changes
    this._store
      .pipe(
        select(this._editedHikeProgramSelectors.getHikeId),
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
              select(this._hikeSelectors.getHike((<IHikeContextState>hikeContext).id)),
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
    this.backgroundImageSelector = this._editedHikeProgramSelectors.getBackgroundImages;
    this.backgroundImageUrlSelector = this._editedHikeProgramSelectors.getBackgroundOriginalUrls();

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

  public saveHike() {
    // Save hikeProgram
    this._store.dispatch(new editedHikeProgramActions.SaveHikeProgram());

    // Save route
    combineLatest(
      this._store.pipe(
        select(this._hikeEditRoutePlannerSelectors.getRoutePlanner),
        take(1)
      ),
      this._store.pipe(
        select(this._editedHikeProgramSelectors.getRouteId),
        take(1)
      )
    ).subscribe(([routePlannerState, routeId]: [IHikeEditRoutePlannerState, string]) => {
      if (routePlannerState && routeId) {
        const _route: IRoute = {
          id: routeId,
          bounds: (<any>routePlannerState.route).bounds,
          route: _pick(routePlannerState.route, ['type', 'features'])
        };
        this._store.dispatch(new commonRouteActions.SaveRoute(_route));
      }
    });
  }

  private _parseGpxRoute() {
    this._store
      .pipe(
        select(this._hikeEditMapSelectors.getMapId),
        filter(id => id !== ''),
        take(1)
      )
      .subscribe((mapId: string) => {
        const _map = this._adminMapService.getMapById(mapId);

        this._routePlannerService.drawRouteLineGeoJSON(this._hikeProgramService.gpxRoute.route.features[0]);

        // Load path to routePlanner state - necessary for drawing pois
        this._routePlannerService.addRouteToTheStore(this._hikeProgramService.gpxRoute.route);

        _map.fitBounds(this._hikeProgramService.gpxRoute);

        delete this._hikeProgramService.gpxRoute;
      });
  }

  public updateHikeState(hikeProgramState: EObjectState) {
    this._store.dispatch(new commonHikeActions.UpdateHikeProgramState(this.paramsId, hikeProgramState));

    if (hikeProgramState === EObjectState.published) {
      const selector = createSelector(
        this._editedHikeProgramSelectors.getStops,
        this._editedHikeProgramSelectors.getRouteId,
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
            if (stop.poiId !== 'endpoint') {
              this._store.dispatch(new commonPoiActions.UpdatePoiState(stop.poiId, EObjectState.published));
            }
          }

          // Publish the route
          this._store.dispatch(new commonRouteActions.UpdateRouteState(routeId, EObjectState.published));
        });
    }
  }

  public openPreview() {
    this.displayPreview = true;
  }

  public handleHikeProgramFeature() {
    this.hikeProgramData$.pipe(take(1)).subscribe((hikeProgramData: IHikeProgramStored) => {
      this._store.dispatch(
        new editedHikeProgramActions.AddHikeProgramDetails({ feature: !hikeProgramData.feature }, true)
      );
    });
  }

  public retrievePlan() {
    this._store
      .pipe(
        select(this._editedHikeProgramSelectors.getRouteId),
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

        const _coords: L.LatLng[] = [];

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
}
