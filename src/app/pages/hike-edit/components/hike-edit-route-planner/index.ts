import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { WaypointMarkerService, RoutePlannerService } from '../../../../shared/services/admin-map';
import { Observable, Subject } from 'rxjs';
import { takeUntil, filter, switchMap, take, debounceTime } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { MessageService, ConfirmationService } from 'primeng/api';
import { State, IHikeEditRoutePlannerState } from '../../../../store';
import { editedHikeProgramActions, hikeEditPoiActions } from '../../../../store/actions';
import { RouteSelectors, IRouteContextState, Route } from 'subrepos/gtrack-common-ngx';
import * as hikeEditRoutePlannerSelectors from '../../../../store/selectors/hike-edit-route-planner';
import * as editedHikeProgramSelectors from '../../../../store/selectors/edited-hike-program';
import { ReverseGeocodingService, HikeProgramService, PoiEditorService } from '../../../../shared/services';
import { IRouteStored } from 'subrepos/provider-client';

import _pick from 'lodash-es/pick';
import _values from 'lodash-es/values';
import { LeafletMapService } from '@common.features/leaflet-map/services/leaflet-map.service';
import * as leafletMapSelectors from '@common.features/leaflet-map/store/selectors';
import { IRouteTotal } from 'app/shared/interfaces';

@Component({
  selector: 'app-hike-edit-route-planner',
  templateUrl: './ui.html'
})
export class HikeEditRoutePlannerComponent implements OnInit, OnDestroy {
  @Input() isPlanning$: Observable<boolean>;
  public routeInfoData$: Observable<IHikeEditRoutePlannerState>;
  public route$: Observable<any>;
  private _destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private _waypointMarkerService: WaypointMarkerService,
    private _routePlannerService: RoutePlannerService,
    private _routeSelectors: RouteSelectors,
    private _hikeProgramService: HikeProgramService,
    private _store: Store<State>,
    private _reverseGeocodingService: ReverseGeocodingService,
    private _confirmationService: ConfirmationService,
    private _poiEditorService: PoiEditorService,
    private _messageService: MessageService,
    private _leafletMapService: LeafletMapService
  ) {}

  ngOnInit() {
    this.routeInfoData$ = this._store.pipe(
      select(hikeEditRoutePlannerSelectors.getRoutePlanner),
      takeUntil(this._destroy$)
    );

    this._store
      .pipe(
        select(leafletMapSelectors.getMapId),
        filter(id => id !== ''),
        switchMap(() => {
          return this._store.pipe(select(editedHikeProgramSelectors.getRouteId));
        }),
        switchMap((routeId: string) => this._store.pipe(select(this._routeSelectors.getRouteContext(routeId)))),
        filter(routeContext => !!routeContext),
        takeUntil(this._destroy$)
      )
      .subscribe((routeContext: IRouteContextState) => {
        // Route saved
        if (routeContext.saved) {
          this._messageService.add({
            severity: 'success',
            summary: 'Route',
            detail: 'Success!'
          });

          this._routePlannerService.refreshRouteOnMap();
          // Route loaded
        } else if (routeContext.loaded) {
          this._store
            .pipe(
              select(this._routeSelectors.getRoute((<IRouteContextState>routeContext).id)),
              filter((route: IRouteStored) => !!route),
              take(1)
            )
            .subscribe((route: IRouteStored) => {
              // Draw an independent path to the map
              this._routePlannerService.drawRouteLineGeoJSON(route.route.features[0]);

              const bounds: L.LatLngBoundsExpression = [[
                route.bounds.NorthEast.lat,
                route.bounds.NorthEast.lon
              ], [
                route.bounds.SouthWest.lat,
                route.bounds.SouthWest.lon
              ]];
              this._leafletMapService.fitBounds(bounds);

              // Load path to routePlanner state - necessary for drawing pois
              this._routePlannerService.addRouteToTheStore(route.route);
            });
        }
      });

    this.route$ = this._store.pipe(
      select(hikeEditRoutePlannerSelectors.getRoute),
      takeUntil(this._destroy$)
    );

    this.route$
      .pipe(
        debounceTime(250),
        takeUntil(this._destroy$)
      )
      .subscribe((route: any) => {
        // Clear location
        if (route.features.length === 1) {
          this._store.dispatch(new editedHikeProgramActions.AddHikeProgramDetails({ location: '' }, false));
        // 1st segment added (line + 2 points)
        } else if (route.features.length === 3) {
          this._updateLocation(route.features[1].geometry.coordinates);
        }

        this.isPlanning$
          .pipe(take(1))
          .subscribe((isPlanning: boolean) => {
            if (isPlanning) {
              this._refreshIcons(route);
            }
          });
      });
  }

  ngOnDestroy() {
    this._destroy$.next(true);
    this._destroy$.complete();
  }

  public removeLast() {
    this._waypointMarkerService.removeLast();
  }

  public closeCircle() {
    this._waypointMarkerService.closeCircle();
  }

  public deletePlan() {
    this._confirmationService.confirm({
      message: 'Are you sure that you want to delete?',
      accept: () => {
        this._store.dispatch(new hikeEditPoiActions.ResetPoiState());
        this._waypointMarkerService.reset();
        this._poiEditorService.refreshPoiMarkers();
      }
    });
  }

  private _updateLocation(coords) {
    this._reverseGeocodingService
      .get({
        lat: coords[1],
        lon: coords[0]
      })
      .then(
        (location: string) => {
          this._store.dispatch(new editedHikeProgramActions.AddHikeProgramDetails({ location: location }, false));
        },
        err => {
          this._store.dispatch(new editedHikeProgramActions.AddHikeProgramDetails({ location: '' }, false));
        }
      );
  }

  private _refreshIcons(route) {
    const _route = new Route({
      id: '',
      timestamp: 0,
      bounds: route.bounds,
      route: _pick(route, ['type', 'features'])
    });

    this._store.dispatch(
      new editedHikeProgramActions.AddHikeProgramDetails(
        {
          elevationIcon: this._hikeProgramService.createElevationIcon(_route),
          routeIcon: this._hikeProgramService.createRouteIcon(_route)
        },
        false
      )
    );
  }
}
