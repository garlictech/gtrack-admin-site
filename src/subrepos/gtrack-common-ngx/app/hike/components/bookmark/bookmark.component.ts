import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { ObjectMarkSelectors } from '../../../object-mark/store/selectors';

import { State } from 'app/store/state';

import * as actions from '../../../object-mark/store/actions';

import { EObjectMarkContext } from 'subrepos/provider-client';
import { AuthenticationSelectors } from '../../../authentication/store';

import { Observable, combineLatest, Subject } from 'rxjs';
import { take, map, takeUntil, filter, tap, delay } from 'rxjs/operators';

import { DebugLog, log } from 'app/log';

import * as _ from 'lodash';

@Component({
  selector: 'gtcn-bookmark',
  template: ''
})
export class BookmarkComponent implements OnDestroy, OnInit {
  @Input()
  public hikeProgramId: string;

  public state$: Observable<boolean>;
  public loggedIn$: Observable<boolean>;

  protected _destroy$ = new Subject<boolean>();

  constructor(
    protected _objectMarkSelectors: ObjectMarkSelectors,
    protected _authSelectors: AuthenticationSelectors.Selectors,
    protected _store: Store<State>
  ) {
    this.loggedIn$ = this._store
      .pipe(
        select(this._authSelectors.loggedIn),
        takeUntil(this._destroy$)
      );

    combineLatest(
      this.loggedIn$,
      this._store.pipe(
        select(this._objectMarkSelectors.getObjectMarkContext(EObjectMarkContext.bookmarkedHike))
      )
    )
    .pipe(
      filter(data => (data[0] === true)),
      take(1),
      map(data => data[1])
    )
    .subscribe(context => {
      log.data('Current context: ', context);

      if (!context || (!context.loaded && !context.loading)) {
        log.data('Dispatch load context');
        this._store.dispatch(new actions.LoadContext(EObjectMarkContext.bookmarkedHike));
      }
    });

    combineLatest(
      this.loggedIn$,
      this._store.pipe(
        select(this._objectMarkSelectors.getObjectMarkContext(EObjectMarkContext.bookmarkedHike))
      )
    )
    .pipe(
      takeUntil(this._destroy$),
      filter(data => (data[0] === true)),
      map(data => data[1]),
      filter(context => _.get(context, 'saved', false)),
      delay(50) // TODO: remove this
    )
    .subscribe(() => {
      log.data('Dispatch load context (because of mark)');
      this._store.dispatch(new actions.LoadContext(EObjectMarkContext.bookmarkedHike));
    });
  }

  @DebugLog
  public bookmarkHike(e: Event) {
    e.preventDefault();
    e.stopPropagation();

    combineLatest(
      this.loggedIn$,
      this._store
        .pipe(
          select(this._objectMarkSelectors.isObjectMarked(EObjectMarkContext.bookmarkedHike, this.hikeProgramId))
        )
    )
    .pipe(
      take(1),
      tap(data => console.log(data)),
      filter(data => (data[0] === true)),
      map(data => data[1]),
    )
    .subscribe(state => {
      log.data('Current state before bookmark', state);
      const mark = !state;

      this._store.dispatch(new actions.MarkObject(EObjectMarkContext.bookmarkedHike, this.hikeProgramId, mark));
    });
  }

  ngOnInit() {
    this.state$ = this._store
      .pipe(
        select(this._objectMarkSelectors.isObjectMarked(EObjectMarkContext.bookmarkedHike, this.hikeProgramId)),
        takeUntil(this._destroy$),
        tap(marked => log.data('Current state: ', marked))
      );
  }

  ngOnDestroy() {
    this._destroy$.next(true);
    this._destroy$.complete();
  }
}
