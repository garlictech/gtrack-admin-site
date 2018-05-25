import { Component, OnInit, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import {
  State, commonHikeActions
} from 'app/store';
import { IHikeProgramStored, EObjectState } from 'subrepos/provider-client';
import { HikeSelectors } from 'subrepos/gtrack-common-ngx';
import { LanguageService } from 'app/shared/services';

import * as _ from 'lodash';

@Component({
  selector: 'gt-hike-list',
  templateUrl: './hike-list.component.html',
  styleUrls: ['./hike-list.component.scss']
})
export class HikeListComponent implements OnInit, OnDestroy {
  public hikeList$: Observable<IHikeProgramStored[]>;
  private _destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private _store: Store<State>,
    private _hikeSelectors: HikeSelectors,
    private _title: Title
  ) {}

  ngOnInit() {
    this._title.setTitle('Hikes');

    this.hikeList$ = this._store
      .select(this._hikeSelectors.getAllHikes) // TODO: getActiveHikes
      .takeUntil(this._destroy$)
      .map((hikes) => _.orderBy(hikes, ['timestamp'], ['desc']));

    this._store.dispatch(new commonHikeActions.LoadHikePrograms());
  }

  ngOnDestroy( ) {
    this._destroy$.next(true);
    this._destroy$.unsubscribe();
  }

  public publishHike(hikeId: string) {
    this._store.dispatch(new commonHikeActions.UpdateHikeProgramState(hikeId, EObjectState.published));
  }

  public deleteHike(hikeId: string) {
    this._store.dispatch(new commonHikeActions.UpdateHikeProgramState(hikeId, EObjectState.archived));
  }

  // TODO: just for testing!!
  public resetState(hikeId: string) {
    this._store.dispatch(new commonHikeActions.UpdateHikeProgramState(hikeId, EObjectState.draft));
  }

  public translateDescription(description, field) {
    return LanguageService.translateDescription(description, field);
  }
}
