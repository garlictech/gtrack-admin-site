import { Component, OnInit, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { HikeDataService } from '../../shared/services';
import { IMockHikeElement } from '../../shared/interfaces';

declare const $: any;

@Component({
  selector: 'gt-hike-edit',
  templateUrl: './hike-edit.component.html',
  styleUrls: ['./hike-edit.component.scss']
})
export class HikeEditComponent implements OnInit, OnDestroy {
  private _routeSubscription: Subscription;
  public hikeData: IMockHikeElement = null;

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _hikeDataService: HikeDataService,
    private _title: Title
  ) {}

  ngOnInit() {
    $.material.options.autofill = true;
    $.material.init();

    this._routeSubscription = this._activatedRoute.params.subscribe(params => {
      // Load hike data from mock DB
      if (params && params.id) {
        this._title.setTitle('Edit hike');

        this.hikeData = this._hikeDataService.getHike(params.id);
      // Create new hike
      } else {
        this._title.setTitle('New hike');

        this.hikeData = {
          title: {},
          description: {},
          summary: {}
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
