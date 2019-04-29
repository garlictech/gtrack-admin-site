import _pick from 'lodash-es/pick';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Observable, Subject } from 'rxjs';
import { debounceTime, filter, switchMap, take, takeUntil } from 'rxjs/operators';

import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { RouteStored } from '@bit/garlictech.angular-features.common.gtrack-interfaces';
import { LeafletMapService } from '@bit/garlictech.angular-features.common.leaflet-map';
import * as leafletMapSelectors from '@bit/garlictech.angular-features.common.leaflet-map/store/selectors';
import { Route, RouteContextState, RouteSelectors } from '@features/common/route';
import { select, Store } from '@ngrx/store';

import { HikeProgramService, PoiEditorService, ReverseGeocodingService } from '../../../../shared/services';
import { RoutePlannerService, WaypointMarkerService } from '../../../../shared/services/admin-map';
import { HikeEditRoutePlannerState, State } from '../../../../store';
import { editedHikeProgramActions, hikeEditPoiActions } from '../../../../store/actions';
import * as editedHikeProgramSelectors from '../../../../store/selectors/edited-hike-program';
import * as hikeEditRoutePlannerSelectors from '../../../../store/selectors/hike-edit-route-planner';

@Component({
  selector: 'app-hike-edit-route-planner',
  templateUrl: './ui.html'
})
export class HikeEditRoutePlannerComponent implements OnInit, OnDestroy {
  @Input() isPlanning$: Observable<boolean>;
  routeInfoData$: Observable<HikeEditRoutePlannerState>;
  route$: Observable<any>;
  private readonly _destroy$: Subject<boolean>;

  constructor(
    private readonly _waypointMarkerService: WaypointMarkerService,
    private readonly _routePlannerService: RoutePlannerService,
    private readonly _routeSelectors: RouteSelectors,
    private readonly _hikeProgramService: HikeProgramService,
    private readonly _store: Store<State>,
    private readonly _reverseGeocodingService: ReverseGeocodingService,
    private readonly _confirmationService: ConfirmationService,
    private readonly _poiEditorService: PoiEditorService,
    private readonly _messageService: MessageService,
    private readonly _leafletMapService: LeafletMapService
  ) {
    this._destroy$ = new Subject<boolean>();
  }

  ngOnInit(): void {
    this.routeInfoData$ = this._store.pipe(
      select(hikeEditRoutePlannerSelectors.getRoutePlanner),
      takeUntil(this._destroy$)
    );

    this._store
      .pipe(
        select(leafletMapSelectors.getMapId),
        filter(id => id !== ''),
        switchMap(() => this._store.pipe(select(editedHikeProgramSelectors.getRouteId))),
        switchMap((routeId: string) => this._store.pipe(select(this._routeSelectors.getRouteContext(routeId)))),
        filter(routeContext => !!routeContext),
        takeUntil(this._destroy$)
      )
      .subscribe((routeContext: RouteContextState) => {
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
              select(this._routeSelectors.getRoute(routeContext.id)),
              filter((route: RouteStored) => !!route),
              take(1)
            )
            .subscribe((route: RouteStored) => {
              // Draw an independent path to the map
              this._routePlannerService.drawRouteLineGeoJSON(route.route.features[0]);

              const bounds: L.LatLngBoundsExpression = [
                [route.bounds.NorthEast.lat, route.bounds.NorthEast.lon],
                [route.bounds.SouthWest.lat, route.bounds.SouthWest.lon]
              ];
              // TODO fotRouteBounds
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

        this.isPlanning$.pipe(take(1)).subscribe((isPlanning: boolean) => {
          if (isPlanning) {
            this._refreshIcons(route);
          }
        });
      });
  }

  ngOnDestroy(): void {
    this._destroy$.next(true);
    this._destroy$.complete();
  }

  removeLast(): void {
    this._waypointMarkerService.removeLast();
  }

  closeCircle(): void {
    this._waypointMarkerService.closeCircle();
  }

  deletePlan(): void {
    this._confirmationService.confirm({
      message: 'Are you sure that you want to delete?',
      accept: () => {
        this._store.dispatch(new hikeEditPoiActions.ResetPoiState());
        this._waypointMarkerService.reset();
        this._poiEditorService.refreshPoiMarkers();
      }
    });
  }

  private _updateLocation(coords): void {
    this._reverseGeocodingService
      .get({
        lat: coords[1],
        lon: coords[0]
      })
      .then(
        (location: string) => {
          this._store.dispatch(new editedHikeProgramActions.AddHikeProgramDetails({ location }, false));
        },
        err => {
          this._store.dispatch(new editedHikeProgramActions.AddHikeProgramDetails({ location: '' }, false));
        }
      );
  }

  private _refreshIcons(route): void {
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
