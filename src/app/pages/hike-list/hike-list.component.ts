import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { HikeDataService } from 'app/shared/services';

@Component({
  selector: 'gt-hike-list',
  templateUrl: './hike-list.component.html',
  styleUrls: ['./hike-list.component.scss']
})
export class HikeListComponent implements OnInit {
  hikeList: any[];

  constructor(
    private _hikeDataService: HikeDataService,
    private _title: Title
  ) {}

  ngOnInit() {
    this._title.setTitle('Hikes');
    this.hikeList = this._hikeDataService.getHikes();
  }

  deleteHike(hikeId) {
    // this._store.dispatch(this._actions.deleteHike(hikeId));
  }
}
