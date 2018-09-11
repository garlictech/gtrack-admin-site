import { Component, OnInit, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { Store, MemoizedSelector, createSelector } from '@ngrx/store';
import { State, IHikeEditRoutePlannerState } from '../../store';
import {
  commonRouteActions,
  commonHikeActions,
  hikeEditMapActions,
  editedHikeProgramActions,
  commonPoiActions,
  hikeEditImageActions
} from '../../store/actions';
import { hikeEditRoutePlannerActions } from '../../store/actions';
import { HikeEditRoutePlannerSelectors, EditedHikeProgramSelectors, HikeEditMapSelectors } from '../../store/selectors';
import {
  WaypointMarkerService,
  RoutePlannerService,
  AdminMapService
} from '../../shared/services/admin-map';
import {
  IHikeProgramStored,
  IRoute,
  EObjectState,
  IBackgroundImageData
} from 'subrepos/provider-client';
import { HikeSelectors, IHikeContextState } from 'subrepos/gtrack-common-ngx';
import { ToasterService } from 'angular2-toaster';
import { HikeProgramService } from '../../shared/services';

import * as uuid from 'uuid/v1';
import * as _ from 'lodash';

@Component({
  selector: 'app-hike-edit',
  templateUrl: './hike-edit.component.html',
  styleUrls: ['./hike-edit.component.scss']
})
export class HikeEditComponent implements OnInit, OnDestroy {
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
    private _activatedRoute: ActivatedRoute,
    private _adminMapService: AdminMapService,
    private _waypointMarkerService: WaypointMarkerService,
    private _routePlannerService: RoutePlannerService,
    private _hikeProgramService: HikeProgramService,
    private _hikeSelectors: HikeSelectors,
    private _hikeEditRoutePlannerSelectors: HikeEditRoutePlannerSelectors,
    private _hikeEditMapSelectors: HikeEditMapSelectors,
    private _editedHikeProgramSelectors: EditedHikeProgramSelectors,
    private _toasterService: ToasterService,
    private _router: Router,
    private _title: Title
  ) {}

  ngOnInit() {
    this.working$ = this._store
      .select(this._editedHikeProgramSelectors.getWorking)
      .takeUntil(this._destroy$);
    this.hikeProgramData$ = this._store
      .select(this._editedHikeProgramSelectors.getData)
      .takeUntil(this._destroy$);

    this._waypointMarkerService.reset();

    this._store.dispatch(new hikeEditMapActions.ResetMapState());
    this._store.dispatch(new hikeEditImageActions.ResetImageState());
    this._store.dispatch(new hikeEditRoutePlannerActions.ResetRoutePlanningState());
    this._store.dispatch(new editedHikeProgramActions.ResetHikeProgram());

    this._activatedRoute.params.takeUntil(this._destroy$).subscribe(params => {
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

    this.allowSave$ = this._store.select(this._editedHikeProgramSelectors.getDirty).takeUntil(this._destroy$);

    this.isPlanning$ = this._store
      .select(this._hikeEditRoutePlannerSelectors.getIsPlanning)
      .takeUntil(this._destroy$);

    // Handling save success
    this._store
      .select(this._editedHikeProgramSelectors.getWorking)
      .takeUntil(this._destroy$)
      .filter(working => working !== null)
      .switchMap(() => this._store.select(this._editedHikeProgramSelectors.getWorking).takeUntil(this._destroy$))
      .filter(working => working === null)
      .switchMap(() => this._store.select(this._editedHikeProgramSelectors.getError).take(1))
      .takeUntil(this._destroy$)
      .subscribe(error => {
        if (error) {
          let msg: string[] = [];
          for (let idx in error) {
            msg.push(`${idx}: ${error[idx]}`);
          }

          this._toasterService.pop({
            type: 'error',
            title: 'Hike',
            body: `Error:<br>${msg.join('<br>')}`,
            timeout: 8000
          });
        } else {
          this._toasterService.pop('success', 'Hike', 'Success!');

          // Load the hike page if it's a new hike
          if (!this.paramsId) {
            this._router.navigate([`/admin/hike/${this._hikeId}`]);
          } else {
            // Disable planning
            this._store.dispatch(new hikeEditRoutePlannerActions.SetPlanning(false));
          }
        }
      });

    this.hikeProgramState$ = this._store.select(this._editedHikeProgramSelectors.getState).takeUntil(this._destroy$);

    // Handling hike context changes
    this._store
      .select(this._editedHikeProgramSelectors.getHikeId)
      .takeUntil(this._destroy$)
      .filter(hikeId => hikeId !== '')
      .switchMap((hikeId: string) =>
        this._store.select(this._hikeSelectors.getHikeContext(hikeId)).takeUntil(this._destroy$)
      )
      .filter(hikeContext => !!hikeContext)
      .subscribe((hikeContext: IHikeContextState) => {
        if (hikeContext.loaded) {
          this._store
            .select(this._hikeSelectors.getHike((<IHikeContextState>hikeContext).id))
            .take(1)
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
      addMarker: url => this._store.dispatch(new hikeEditImageActions.AddImageMarker(url)),
      removeMarker: url => this._store.dispatch(new hikeEditImageActions.RemoveImageMarker(url)),
    };
  }

  ngOnDestroy() {
    this._destroy$.next(true);
    this._destroy$.unsubscribe();
  }

  public saveHike() {
    // Save hikeProgram
    this._store.dispatch(new editedHikeProgramActions.SaveHikeProgram());

    // Save route
    Observable.combineLatest(
      this._store.select(this._hikeEditRoutePlannerSelectors.getRoutePlanner).take(1),
      this._store.select(this._editedHikeProgramSelectors.getRouteId).take(1)
    ).subscribe(([routePlannerState, routeId]: [IHikeEditRoutePlannerState, string]) => {
      if (routePlannerState && routeId) {
        let _route: IRoute = {
          id: routeId,
          bounds: (<any>routePlannerState.route).bounds,
          route: _.pick(routePlannerState.route, ['type', 'features'])
        };
        this._store.dispatch(new commonRouteActions.SaveRoute(_route));
      }
    });
  }

  private _parseGpxRoute() {
    this._store
      .select(this._hikeEditMapSelectors.getMapId)
      .filter(id => id !== '')
      .take(1)
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
        .skipWhile((hikeState: EObjectState) => hikeState !== EObjectState.published)
        .take(1)
        .switchMap(() => this._store.select(selector).take(1))
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
}
