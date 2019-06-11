import { Component, OnInit } from '@angular/core';
import { getHikeSpeed, getHikeStartDate } from '@bit/garlictech.angular-features.common.settings/store/selectors';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';

@Component({
  selector: 'gtrack-common-hike-settings',
  template: ''
})
export class HikeSettingsComponent implements OnInit {
  startDate$: Observable<Date>;
  speed$: Observable<number>;

  constructor(protected _store: Store<any>) {}

  ngOnInit(): void {
    this.startDate$ = this._store.pipe(select(getHikeStartDate));
    this.speed$ = this._store.pipe(select(getHikeSpeed));
  }
}
