import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs/Subject';
import {
  State, commonHikeActions
} from 'app/store';
import { IHikeProgram } from 'subrepos/provider-client';
import { HikeSelectors } from 'subrepos/gtrack-common-ngx';

@Component({
  selector: 'gt-hike-list',
  templateUrl: './hike-list.component.html',
  styleUrls: ['./hike-list.component.scss']
})
export class HikeListComponent implements OnInit {
  hikeList: IHikeProgram[];

  constructor(
    private _store: Store<State>,
    private _hikeSelectors: HikeSelectors,
    private _title: Title
  ) {}

  ngOnInit() {
    this._title.setTitle('Hikes');

    this._store.select(this._hikeSelectors.getAllHikes)
      .take(1)
      .subscribe((hikes) => {
        this.hikeList = hikes;
      });

    this._store.dispatch(new commonHikeActions.LoadHikePrograms());
  }

  deleteHike(hikeId) {
    // this._store.dispatch(this._actions.deleteHike(hikeId));
  }
}
