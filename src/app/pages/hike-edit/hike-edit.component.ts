import { Component, OnInit, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import { Store } from '@ngrx/store';
import {
  State, hikeEditActions, hikeEditGeneralInfoActions, commonRouteActions, commonHikeActions
} from 'app/store';
import { HikeEditGeneralInfoSelectors } from 'app/store/selectors';
import { HikeDataService } from 'app/shared/services';
import { IHikeProgramStored, IHikeProgram } from 'subrepos/provider-client';
import { RouteActionTypes, HikeSelectors, IHikeContextState } from 'subrepos/gtrack-common-ngx';
import { ToasterService } from 'angular2-toaster';

import * as uuid from 'uuid/v1';

@Component({
  selector: 'gt-hike-edit',
  templateUrl: './hike-edit.component.html',
  styleUrls: ['./hike-edit.component.scss']
})
export class HikeEditComponent implements OnInit, OnDestroy {
  private _hikeId: string;
  private _destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private _store: Store<State>,
    private _activatedRoute: ActivatedRoute,
    private _hikeDataService: HikeDataService,
    private _hikeSelectors: HikeSelectors,
    private _hikeEditGeneralInfoSelectors: HikeEditGeneralInfoSelectors,
    private _toasterService: ToasterService,
    private _router: Router,
    private _title: Title
  ) {}

  ngOnInit() {
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
          this._store.dispatch(new commonHikeActions.LoadHikeProgram(_hikeId));

          // Generate initial route id and load the empty route (for save toaster handling)
          const _routeId = uuid();
          this._store.dispatch(new hikeEditGeneralInfoActions.SetRouteId({ routeId: _routeId }));
          this._store.dispatch(new commonRouteActions.LoadRoute(_routeId));

          // Create initial language block
          this._store.dispatch(new hikeEditGeneralInfoActions.SetDescriptions({
            descriptions: [{
                id: 'en_US',
                title: `Test hike #${new Date().getTime()}`,
                fullDescription: 'desc',
                summary: 'summary'
            }]
          }));
        }
      });

    // Handling hike save
    this._store.select(this._hikeEditGeneralInfoSelectors.getHikeId)
      .takeUntil(this._destroy$)
      .switchMap((hikeId: string) => this._store.select(this._hikeSelectors.getHikeContext(hikeId)))
      .filter(hikeContext => !!(hikeContext && hikeContext.saved))
      .subscribe((hikeContext) => {
        this._toasterService.pop('success', 'Success!', 'Hike saved!');
        this._router.navigate([`/admin/hike/${(<IHikeContextState>hikeContext).id}`]);
      });

    // Handling hike load
    this._store.select(this._hikeEditGeneralInfoSelectors.getHikeId)
      .switchMap((hikeId: string) => this._store.select(this._hikeSelectors.getHikeContext(hikeId)))
      .filter(hikeContext => !!(hikeContext && hikeContext.loaded))
      .switchMap((hikeContext) => this._store.select(this._hikeSelectors.getHike((<IHikeContextState>hikeContext).id)))
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
    this._store.dispatch(new hikeEditActions.CollectHikeData());
  }
}
