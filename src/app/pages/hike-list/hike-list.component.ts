import { Component, OnInit, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import {
  State, commonHikeActions
} from 'app/store';
import { IHikeProgram } from 'subrepos/provider-client';
import { HikeSelectors } from 'subrepos/gtrack-common-ngx';
import { LanguageService } from 'app/shared/services';

import * as _ from 'lodash';

@Component({
  selector: 'gt-hike-list',
  templateUrl: './hike-list.component.html',
  styleUrls: ['./hike-list.component.scss']
})
export class HikeListComponent implements OnInit, OnDestroy {
  public hikeList$: Observable<IHikeProgram[]>;
  private _destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private _store: Store<State>,
    private _hikeSelectors: HikeSelectors,
    private _title: Title
  ) {}

  ngOnInit() {
    this._title.setTitle('Hikes');

    this.hikeList$ = this._store
      .select(this._hikeSelectors.getAllHikes)
      .takeUntil(this._destroy$)
      .map((hikes) => _.orderBy(hikes, ['timestamp'], ['desc']));

    this._store.dispatch(new commonHikeActions.LoadHikePrograms());
  }

  ngOnDestroy( ) {
    this._destroy$.next(true);
    this._destroy$.unsubscribe();
  }

  deleteHike(hikeId) {
    // this._store.dispatch(this._actions.deleteHike(hikeId));
  }

  public translateDescription(description, field) {
    return LanguageService.translateDescription(description, field);
  }
}
