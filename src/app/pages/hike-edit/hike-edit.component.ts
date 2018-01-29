import { Component, OnInit, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { Store } from '@ngrx/store';
import { State } from 'app/store';

import { HikeDataService } from 'app/shared/services';
import { IMockHikeElement } from 'app/shared/interfaces';

declare const $: any;

@Component({
  selector: 'gt-hike-edit',
  templateUrl: './hike-edit.component.html',
  styleUrls: ['./hike-edit.component.scss']
})
export class HikeEditComponent implements OnInit, OnDestroy {
  private _routeSubscription: Subscription;
  public hikeData: IMockHikeElement;

  constructor(
    private _store: Store<State>,
    private _activatedRoute: ActivatedRoute,
    private _hikeDataService: HikeDataService,
    private _title: Title
  ) {}

  ngOnInit() {
    /* TODO: deprecated
    $.material.options.autofill = true;
    $.material.init();
    */

    this._routeSubscription = this._activatedRoute.params.subscribe(params => {
      // Load hike data from mock DB
      if (params && params.id) {
        this._title.setTitle('Edit hike');

        // todo: load from db
        this.hikeData = this._hikeDataService.getHike(params.id);
      // Create new hike
      } else {
        this._title.setTitle('New hike');

        // todo: from store
        this.hikeData = {
          description: {}
        };
      }
    });
  }

  public ngOnDestroy() {
    if (this._routeSubscription) {
      this._routeSubscription.unsubscribe();
    }
  }

  public save() {
    // this._store.dispatch(this._actions.saveHike(this.hikeData));
  }
}
