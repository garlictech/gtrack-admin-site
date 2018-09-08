import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Store, createSelector } from '@ngrx/store';
import { ObjectMarkSelectors } from '../../../object-mark/store/selectors';

import { State } from 'app/store/state';

import * as actions from '../../../object-mark/store/actions';

import { EObjectMarkContext } from 'subrepos/provider-client';

import { Observable } from 'rxjs';
import { Subject } from 'rxjs/Subject';
import { take, takeUntil, filter, switchMap, tap, delay } from 'rxjs/operators';

import { DebugLog, log } from 'app/log';

@Component({
  selector: 'gtcn-bookmark',
  template: ''
})
export class BookmarkComponent implements OnDestroy, OnInit {
  @Input()
  public hikeProgramId: string;

  public state$: Observable<boolean>;

  protected _destroy$ = new Subject<boolean>();

  constructor(protected _objectMarkSelectors: ObjectMarkSelectors, protected _store: Store<State>) {
    this._store
      .select(this._objectMarkSelectors.getObjectMarkContext(EObjectMarkContext.bookmarkedHike))
      .pipe(take(1))
      .subscribe(context => {
        log.data('Current context: ', context);
        if (!context || (!context.loaded && !context.loading)) {
          log.data('Dispatch load context');
          this._store.dispatch(new actions.LoadContext(EObjectMarkContext.bookmarkedHike));
        }
      });

    this._store
      .select(this._objectMarkSelectors.getObjectMarkContext(EObjectMarkContext.bookmarkedHike))
      .pipe(
        takeUntil(this._destroy$),
        filter(context => context.saved),
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

    this._store
      .select(this._objectMarkSelectors.isObjectMarked(EObjectMarkContext.bookmarkedHike, this.hikeProgramId))
      .pipe(take(1))
      .subscribe(state => {
        log.data('Current state before bookmark', state);
        const mark = !state;

        this._store.dispatch(new actions.MarkObject(EObjectMarkContext.bookmarkedHike, this.hikeProgramId, mark));
      });
  }

  ngOnInit() {
    this.state$ = this._store
      .select(this._objectMarkSelectors.isObjectMarked(EObjectMarkContext.bookmarkedHike, this.hikeProgramId))
      .pipe(
        takeUntil(this._destroy$),
        tap(marked => log.data('Current state: ', marked))
      );
  }

  ngOnDestroy() {
    this._destroy$.next(true);
    this._destroy$.complete();
  }
}
