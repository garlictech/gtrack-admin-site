import { combineLatest, Observable, of } from 'rxjs';
import { skipWhile, switchMap, take } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import * as markerIconSelectors from '@bit/garlictech.angular-features.common.marker-icons/store';
import { select, Store } from '@ngrx/store';

import { State } from '../../../store';

@Injectable()
export class HikeResolver implements Resolve<any> {
  constructor(private readonly _store: Store<State>) {}

  resolve(): Observable<boolean> {
    return combineLatest(
      this._store.pipe(
        select(markerIconSelectors.getAllSvgMarkersCount),
        skipWhile(c => c === 0),
        take(1)
      ),
      this._store.pipe(
        select(markerIconSelectors.getAllSvgIconsCount),
        skipWhile(c => c === 0),
        take(1)
      )
    ).pipe(switchMap(() => of(true)));
  }
}
