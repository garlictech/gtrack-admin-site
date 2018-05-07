import { Component, OnInit, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Store } from '@ngrx/store';
import {
  State,
  hikeEditActions,
  commonRouteActions,
  commonHikeActions,
  IHikeEditRoutePlannerState,
  hikeEditMapActions,
  hikeEditRoutePlannerActions,
  editedHikeProgramActions
} from 'app/store';
import { HikeEditRoutePlannerSelectors, EditedHikeProgramSelectors } from 'app/store/selectors';
import { RoutingControlService, WaypointMarkerService } from '../../shared/services/admin-map';
import { IHikeProgramStored, IHikeProgram, IPoi, IRoute } from 'subrepos/provider-client';
import { RouteActionTypes, HikeSelectors, IHikeContextState } from 'subrepos/gtrack-common-ngx';
import { ToasterService } from 'angular2-toaster';

import * as uuid from 'uuid/v1';
import * as _ from 'lodash';

@Component({
  selector: 'gt-hike-edit',
  templateUrl: './hike-edit.component.html',
  styleUrls: ['./hike-edit.component.scss']
})
export class HikeEditComponent implements OnInit, OnDestroy {
  public allowSave$: Observable<boolean>;
  public working$: Observable<string | null>;

  private _destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private _store: Store<State>,
    private _activatedRoute: ActivatedRoute,
    private _routingControlService: RoutingControlService,
    private _waypointMarkerService: WaypointMarkerService,
    private _hikeSelectors: HikeSelectors,
    private _hikeEditRoutePlannerSelectors: HikeEditRoutePlannerSelectors,
    private _editedHikeProgramSelectors: EditedHikeProgramSelectors,
    private _toasterService: ToasterService,
    private _router: Router,
    private _title: Title,
  ) {}

  ngOnInit() {
    this.working$ = this._store.select(this._editedHikeProgramSelectors.getWorking).takeUntil(this._destroy$);

    this._routingControlService.reset();
    this._waypointMarkerService.reset();

    this._store.dispatch(new hikeEditMapActions.ResetMapState());
    this._store.dispatch(new hikeEditRoutePlannerActions.ResetRoutePlanningState());
    this._store.dispatch(new editedHikeProgramActions.ResetHikeProgram());

    this._activatedRoute.params
      .takeUntil(this._destroy$)
      .subscribe(params => {
        // Edit existing hike
        if (params && params.id) {
          // Set page title
          this._title.setTitle('Edit hike');

          // Set hike id and load hikeProgram data
          this._store.dispatch(new editedHikeProgramActions.AddHikeProgramDetails({ id: params.id }, false));
          this._store.dispatch(new commonHikeActions.LoadHikeProgram(params.id));
        // Create new hike
        } else {
          // Set page title
          this._title.setTitle('New hike');

          // Generate initial hike id and load the empty hikeProgram (for save toaster handling)
          const _hikeId = uuid();
          this._store.dispatch(new editedHikeProgramActions.AddHikeProgramDetails({ id: _hikeId }, false));
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
        }
      });

    this.allowSave$ = this._store.select(this._editedHikeProgramSelectors.getDirty).takeUntil(this._destroy$);

    // Handling saving error
    this._store
      .select(this._editedHikeProgramSelectors.getError)
      .takeUntil(this._destroy$)
      .filter(error => !!error)
      .subscribe(error => {
        let msg: string[] = [];
        for (let idx in error) {
          msg.push(`<br>${idx}: ${error[idx]}`);
        }
        this._toasterService.pop({
          type: 'error',
          title: 'Hike not saved!',
          body: `Error(s):${msg.join()}`,
          timeout: 8000
        });
      });

    // Handling save success
    this._store
      .select(this._editedHikeProgramSelectors.getWorking)
      .takeUntil(this._destroy$)
      .filter(working => working !== null)
      .switchMap(() => {
        return this._store.select(this._editedHikeProgramSelectors.getWorking).takeUntil(this._destroy$);
      })
      .filter(working => working === null)
      .switchMap(() => {
        return this._store.select(this._editedHikeProgramSelectors.getHikeId).takeUntil(this._destroy$);
      })
      .takeUntil(this._destroy$)
      .subscribe((hikeId: string) => {
        this._toasterService.pop('success', 'Success!', 'Hike saved!');

        // Deprecated??? this._store.dispatch(new commonHikeActions.HikeProgramModified(hikeId));

        // Angular 5 doesn't reload the route!
        // this._router.navigate([`/admin/hike/${hikeId}`]);
      });

    // Handling hike context changes
    this._store
      .select(this._editedHikeProgramSelectors.getHikeId)
      .takeUntil(this._destroy$)
      .filter(hikeId => hikeId !== '')
      .switchMap((hikeId: string) => this._store.select(this._hikeSelectors.getHikeContext(hikeId)).takeUntil(this._destroy$))
      .filter(hikeContext => !!(hikeContext))
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
}
