import { Component, OnInit, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import { Store } from '@ngrx/store';
import { State, hikeEditActions } from 'app/store';

import { HikeDataService } from 'app/shared/services';
import { IMockHikeElement } from 'app/shared/interfaces';
import { IHikeProgramStored } from 'subrepos/provider-client';

import * as uuid from 'uuid/v4';

@Component({
  selector: 'gt-hike-edit',
  templateUrl: './hike-edit.component.html',
  styleUrls: ['./hike-edit.component.scss']
})
export class HikeEditComponent implements OnInit, OnDestroy {
  public hikeData: IMockHikeElement;
  private _hikeId: string;
  private _destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private _store: Store<State>,
    private _activatedRoute: ActivatedRoute,
    private _hikeDataService: HikeDataService,
    private _title: Title
  ) {}

  ngOnInit() {
    this._activatedRoute.params
      .takeUntil(this._destroy$)
      .subscribe(params => {
        // Load hike data from mock DB
        if (params && params.id) {
          this._hikeId = params.id;

          this._title.setTitle('Edit hike');

          // todo: load from db
          this.hikeData = this._hikeDataService.getHike(params.id);
        // Create new hike
        } else {
          this._hikeId = uuid();

          this._title.setTitle('New hike');

          // todo: from store
          this.hikeData = {
            description: {
              'en_US': {
                title: '',
                fullDescription: '',
                summary: ''
              }
            }
          };
        }
      });
  }

  ngOnDestroy( ) {
    this._destroy$.next(true);
    this._destroy$.unsubscribe();
  }

  public saveHike() {
    this._store.dispatch(new hikeEditActions.CollectHikeData({
      hikeId: this._hikeId
    }));
  }
}
