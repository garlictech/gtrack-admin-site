import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import { State, Actions } from '../../store';

import { HikeDataService } from '../../shared/services';

@Component({
  selector: 'gt-hike-list',
  templateUrl: './hike-list.component.html',
  styleUrls: ['./hike-list.component.scss']
})
export class HikeListComponent implements OnInit {
  hikeList: any[];

  constructor(
    private _store: Store<State>,
    private _hikeDataService: HikeDataService,
    private _title: Title,
    private _actions: Actions
  ) {}

  ngOnInit() {
    this._title.setTitle('Hikes');
    this.hikeList = this._hikeDataService.getHikes();
  }

  deleteHike(hikeId) {
    this._store.dispatch(this._actions.deleteHike(hikeId));
  }
}
