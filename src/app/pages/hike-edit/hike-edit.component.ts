import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Store } from '@ngrx/store';
import {
  State, hikeEditActions, hikeEditGeneralInfoActions, commonRouteActions, commonHikeActions, IHikeEditRoutePlannerState, hikeEditMapActions, hikeEditRoutePlannerActions
} from 'app/store';
import { HikeEditGeneralInfoSelectors, HikeEditRoutePlannerSelectors } from 'app/store/selectors';
import { HikeDataService } from 'app/shared/services';
import { IHikeProgramStored, IHikeProgram, IPoi, IRoute } from 'subrepos/provider-client';
import { RouteActionTypes, HikeSelectors, IHikeContextState } from 'subrepos/gtrack-common-ngx';
import { ToasterService } from 'angular2-toaster';

import * as uuid from 'uuid/v1';
import * as _ from 'lodash';
import { RoutingControlService, WaypointMarkerService } from '../../shared/services/admin-map';
import { IGeneralInfoState } from '../../store/state';

@Component({
  selector: 'gt-hike-edit',
  templateUrl: './hike-edit.component.html',
  styleUrls: ['./hike-edit.component.scss']
})
export class HikeEditComponent implements OnInit, OnDestroy {
  public allowSave$: Observable<boolean>;
  public routeInfoData$: Observable<IHikeEditRoutePlannerState>;
  private _hikeId: string;
  private _destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private _store: Store<State>,
    private _activatedRoute: ActivatedRoute,
    private _hikeDataService: HikeDataService,
    private _routingControlService: RoutingControlService,
    private _waypointMarkerService: WaypointMarkerService,
    private _hikeSelectors: HikeSelectors,
    private _hikeEditGeneralInfoSelectors: HikeEditGeneralInfoSelectors,
    private _hikeEditRoutePlannerSelectors: HikeEditRoutePlannerSelectors,
    private _toasterService: ToasterService,
    private _router: Router,
    private _title: Title,
    private _zone: NgZone
  ) {}

  ngOnInit() {
    this._routingControlService.reset();
    this._waypointMarkerService.reset();
    this._store.dispatch(new hikeEditGeneralInfoActions.ResetGeneralInfoState());
    this._store.dispatch(new hikeEditMapActions.ResetMapState());
    this._store.dispatch(new hikeEditRoutePlannerActions.ResetRoutePlanningState());

    this._activatedRoute.params
      .takeUntil(this._destroy$)
      .subscribe(params => {
        if (params && params.id) {
          // Set page title
          this._title.setTitle('Edit hike');

          // Set hike id and load hikeProgram data
          this._store.dispatch(new hikeEditGeneralInfoActions.SetHikeId({
            hikeId: params.id
          }));
          this._store.dispatch(new commonHikeActions.LoadHikeProgram(params.id));
        // Create new hike
        } else {
          // Set page title
          this._title.setTitle('New hike');

          // Generate initial hike id and load the empty hikeProgram (for save toaster handling)
          const _hikeId = uuid();
          this._store.dispatch(new hikeEditGeneralInfoActions.SetHikeId({ hikeId: _hikeId }));
          this._store.dispatch(new commonHikeActions.HikeProgramModified(_hikeId));

          // Generate initial route id and load the empty route (for save toaster handling)
          const _routeId = uuid();
          this._store.dispatch(new hikeEditGeneralInfoActions.SetRouteId({ routeId: _routeId }));
          this._store.dispatch(new commonRouteActions.RouteModified(_routeId));

          // Create initial language block
          this._store.dispatch(new hikeEditGeneralInfoActions.SetDescriptions({
            descriptions: [{
              id: 'en_US',
              title: `Test hike #${new Date().getTime()}`,
              fullDescription: 'desc',
              summary: 'summary'
            }]
          }));

          // Store has been initialized
          this._store.dispatch(new hikeEditGeneralInfoActions.SetInitialized());
        }
      });

    this.routeInfoData$ = this._store
      .select(this._hikeEditRoutePlannerSelectors.getRoutePlanner)
      .takeUntil(this._destroy$);

    this.allowSave$ = Observable
      .combineLatest(
        this._store.select(this._hikeEditGeneralInfoSelectors.getPois).takeUntil(this._destroy$),
        this.routeInfoData$
      )
      .takeUntil(this._destroy$)
      .map(([inHikePois, routeInfoData]: [any[], any]) => {
        return inHikePois.length > 0 && (routeInfoData.segments && routeInfoData.segments.length > 0);
      })

    // Handling hike save
    this._store
      .select(this._hikeEditGeneralInfoSelectors.getHikeId)
      .switchMap((hikeId: string) => this._store.select(this._hikeSelectors.getHikeContext(hikeId)))
      .filter(hikeContext => !!(hikeContext && hikeContext.saved))
      .takeUntil(this._destroy$)
      .subscribe((hikeContext) => {
        this._toasterService.pop('success', 'Success!', 'Hike saved!');

        this._store.dispatch(new commonHikeActions.HikeProgramModified((<IHikeContextState>hikeContext).id));

        this._router.navigate([`/admin/hike/${(<IHikeContextState>hikeContext).id}`]);
      });

    // Handling hike load
    this._store
      .select(this._hikeEditGeneralInfoSelectors.getHikeId)
      .switchMap((hikeId: string) => {
        return this._store
          .select(this._hikeSelectors.getHikeContext(hikeId))
          .takeUntil(this._destroy$)
      })
      .filter(hikeContext => !!(hikeContext && hikeContext.loaded))
      .switchMap((hikeContext) => {
        return this._store
          .select(this._hikeSelectors.getHike((<IHikeContextState>hikeContext).id))
          .takeUntil(this._destroy$)
      })
      .take(1)
      .subscribe((hike) => {
        this._hikeDataService.splitHikeDataToStore(<IHikeProgram>hike);
      });
  }

  ngOnDestroy( ) {
    this._destroy$.next(true);
    this._destroy$.unsubscribe();
  }

  public saveHike() {
    this._saveRoute();
    this._store.dispatch(new hikeEditActions.CollectHikeData());
  }

  private _saveRoute() {
    Observable
      .combineLatest(
        this._store.select(this._hikeEditRoutePlannerSelectors.getRoutePlanner).take(1),
        this._store.select(this._hikeEditGeneralInfoSelectors.getRouteId).take(1)
      )
      .takeUntil(this._destroy$)
      .subscribe(([routePlannerState, routeId]: [IHikeEditRoutePlannerState, string]) => {
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
}
