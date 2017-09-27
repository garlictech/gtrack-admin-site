import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { State, GtActions } from '../../store';

import { HikeDataService, HikeDataSource } from '../../shared/services';

@Component({
    selector: 'gt-hike-list',
    templateUrl: './hike-list.component.html',
    styleUrls: ['./hike-list.component.scss']
})
export class HikeListComponent implements OnInit {
    displayedColumns = ['id', 'title', 'control'];
    hikeDataSource: HikeDataSource;

    constructor(
        private _store: Store<State>,
        private _hikeDataService: HikeDataService
    ) {}

    ngOnInit() {
        this.hikeDataSource = this._hikeDataService.getHikes();
    }

    deleteHike(hikeId) {
        this._store.dispatch(new GtActions.DeleteHikeAction(hikeId));
    }
}
