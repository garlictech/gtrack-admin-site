import { Component, OnInit, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import { Store } from '@ngrx/store';
import { State, hikeEditActions, hikeEditGeneralInfoActions, commonRouteActions, commonHikeActions } from 'app/store';

import { HikeDataService } from 'app/shared/services';
import { IMockHikeElement } from 'app/shared/interfaces';
import { IHikeProgramStored } from 'subrepos/provider-client';
import { RouteActionTypes, HikeSelectors } from 'subrepos/gtrack-common-ngx';

import { ToasterService } from 'angular2-toaster';

import * as uuid from 'uuid/v1';

@Component({
  selector: 'gt-hike-edit',
  templateUrl: './hike-edit.component.html',
  styleUrls: ['./hike-edit.component.scss']
})
export class HikeEditComponent implements OnInit, OnDestroy {
  public hikeData: IMockHikeElement = {};
  private _hikeId: string;
  private _destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private _store: Store<State>,
    private _activatedRoute: ActivatedRoute,
    private _hikeDataService: HikeDataService,
    private _hikeSelectors: HikeSelectors,
    private _toasterService: ToasterService,
    private _router: Router,
    private _title: Title
  ) {}

  ngOnInit() {
    this._activatedRoute.params
      .takeUntil(this._destroy$)
      .subscribe(params => {
        // Load hike data from mock DB
        if (params && params.id) {
          // Set page title
          this._title.setTitle('Edit hike');

          // Set hike id
          this._store.dispatch(new hikeEditGeneralInfoActions.SetHikeId({
            hikeId: params.id
          }));

          // todo: load from db
          this.hikeData = this._hikeDataService.getHike(params.id);
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
                title: 'Test hike',
                fullDescription: 'desc',
                summary: 'summary'
            }]
          }));
        }
      });

    this._store.select((state: State) => state.hikeEditGeneralInfo.generalInfo.hikeId)
      .takeUntil(this._destroy$)
      .switchMap((hikeId: string) => {
        return this._store.select(this._hikeSelectors.getHikeContext(hikeId))
      })
      .subscribe((hikeContext) => {
        if (hikeContext && hikeContext.saved) {
          this._toasterService.pop('success', 'Success!', 'Hike saved!');
          this._router.navigate([`/admin/hike/${hikeContext.id}`]);
        }
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
