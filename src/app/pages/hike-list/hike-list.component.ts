import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import {
  State, commonHikeActions
} from 'app/store';
import { IHikeProgram } from 'subrepos/provider-client';
import { HikeSelectors } from 'subrepos/gtrack-common-ngx';
import { LanguageService } from 'app/shared/services';

@Component({
  selector: 'gt-hike-list',
  templateUrl: './hike-list.component.html',
  styleUrls: ['./hike-list.component.scss']
})
export class HikeListComponent implements OnInit {
  public hikeList$: Observable<IHikeProgram[]>;

  constructor(
    private _store: Store<State>,
    private _hikeSelectors: HikeSelectors,
    private _title: Title
  ) {}

  ngOnInit() {
    this._title.setTitle('Hikes');

    this.hikeList$ = this._store.select(this._hikeSelectors.getAllHikes);

    this._store.dispatch(new commonHikeActions.LoadHikePrograms());
  }

  deleteHike(hikeId) {
    // this._store.dispatch(this._actions.deleteHike(hikeId));
  }

  public translateDescription(description, field) {
    return LanguageService.translateDescription(description, field);
  }
}
