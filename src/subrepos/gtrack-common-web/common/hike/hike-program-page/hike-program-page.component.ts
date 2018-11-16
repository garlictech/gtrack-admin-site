import { Component, Input, ChangeDetectionStrategy, ViewEncapsulation, OnInit } from '@angular/core';
import { HikeProgram } from 'subrepos/gtrack-common-ngx';
import { getHikeStartDate, getHikeSpeed } from '@common.features/settings/store/selectors';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';

import { State } from 'app/store';

import _get from 'lodash-es/get';

@Component({
  selector: 'gtrack-hike-program-page',
  templateUrl: './hike-program-page.component.html',
  styleUrls: ['./hike-program-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class HikeProgramPageComponent implements OnInit {
  @Input()
  public hikeProgram: HikeProgram;

  public startDate$: Observable<Date>;
  public speed$: Observable<number>;

  public get images() {
    let urls: string[] = [];

    if (this.hikeProgram && this.hikeProgram.backgroundImages instanceof Array) {
      const imageUrls = this.hikeProgram.backgroundImages;

      urls = imageUrls.map(image => _get(image, 'original.url', ''));
    }

    return urls;
  }

  constructor(
    private _store: Store<State>
  ) {

  }

  ngOnInit() {
    this.startDate$ = this._store
      .pipe(
        select(getHikeStartDate)
      );

    this.speed$ = this._store
      .pipe(
        select(getHikeSpeed)
      );
  }
}
