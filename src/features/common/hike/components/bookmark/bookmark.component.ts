import _get from 'lodash-es/get';
import { combineLatest, Observable, Subject } from 'rxjs';
import { delay, filter, map, take, takeUntil, tap } from 'rxjs/operators';

import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { AuthenticationSelectors } from '@bit/garlictech.angular-features.common.authentication';
import { EObjectMarkContext } from '@bit/garlictech.angular-features.common.gtrack-interfaces';
import { select, Store } from '@ngrx/store';

import * as actions from '@bit/garlictech.angular-features.common.object-mark/store/actions';
import { ObjectMarkSelectors } from '@bit/garlictech.angular-features.common.object-mark/store/selectors';
import { DebugLog, log } from '../../log';

@Component({
  selector: 'gtrack-common-bookmark',
  template: ''
})
export class BookmarkComponent implements OnDestroy, OnInit {
  @Input() hikeProgramId: string;

  state$: Observable<boolean>;
  loggedIn$: Observable<boolean>;

  protected _destroy$: Subject<boolean>;

  constructor(
    protected _objectMarkSelectors: ObjectMarkSelectors,
    protected _authSelectors: AuthenticationSelectors.Selectors,
    protected _store: Store<any>
  ) {
    this._destroy$ = new Subject<boolean>();

    this.loggedIn$ = this._store.pipe(
      select(this._authSelectors.loggedIn),
      takeUntil(this._destroy$)
    );

    combineLatest(
      this.loggedIn$,
      this._store.pipe(select(this._objectMarkSelectors.getObjectMarkContext(EObjectMarkContext.bookmarkedHike)))
    )
      .pipe(
        filter(data => data[0]),
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
      this._store.pipe(select(this._objectMarkSelectors.getObjectMarkContext(EObjectMarkContext.bookmarkedHike)))
    )
      .pipe(
        takeUntil(this._destroy$),
        filter(data => data[0]),
        map(data => data[1]),
        filter(context => _get(context, 'saved', false)),
        delay(50) // TODO: remove this
      )
      .subscribe(() => {
        log.data('Dispatch load context (because of mark)');
        this._store.dispatch(new actions.LoadContext(EObjectMarkContext.bookmarkedHike));
      });
  }

  @DebugLog bookmarkHike(e: Event): void {
    e.preventDefault();
    e.stopPropagation();

    combineLatest(
      this.loggedIn$,
      this._store.pipe(
        select(this._objectMarkSelectors.isObjectMarked(EObjectMarkContext.bookmarkedHike, this.hikeProgramId))
      )
    )
      .pipe(
        take(1),
        tap(data => console.log(data)),
        filter(data => data[0]),
        map(data => data[1])
      )
      .subscribe(state => {
        log.data('Current state before bookmark', state);
        const mark = !state;

        this._store.dispatch(new actions.MarkObject(EObjectMarkContext.bookmarkedHike, this.hikeProgramId, mark));
      });
  }

  ngOnInit(): void {
    this.state$ = this._store.pipe(
      select(this._objectMarkSelectors.isObjectMarked(EObjectMarkContext.bookmarkedHike, this.hikeProgramId)),
      takeUntil(this._destroy$),
      tap(marked => log.data('Current state: ', marked))
    );
  }

  ngOnDestroy(): void {
    this._destroy$.next(true);
    this._destroy$.complete();
  }
}
