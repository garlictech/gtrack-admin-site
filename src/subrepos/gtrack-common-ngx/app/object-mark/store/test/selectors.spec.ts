import { TestBed } from '@angular/core/testing';
import { Store, StoreModule } from '@ngrx/store';
import { EObjectMarkContext } from 'subrepos/provider-client';
import { Subject } from 'rxjs/Subject';
import { takeUntil } from 'rxjs/operators/takeUntil';

import { objectMarkReducer } from '../reducer';
import { IObjectMarkState } from '../state';
import { ObjectMarkSelectors } from '../selectors';
import { EXTERNAL_OBJECT_MARK_DEPENDENCIES } from '../../externals';

import * as Actions from '../actions';

describe('ObjectMark selectors', () => {
  let store: Store<IObjectMarkState>;
  let destroy$: Subject<boolean>;

  let contexts = ['foo1', 'foo2'];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          objectMarks: objectMarkReducer
        })
      ],
      providers: [
        {
          provide: EXTERNAL_OBJECT_MARK_DEPENDENCIES,
          useValue: {
            storeDomain: 'objectMarks'
          }
        },
        ObjectMarkSelectors
      ]
    });

    destroy$ = new Subject<boolean>();

    store = TestBed.get(Store);
    spyOn(store, 'dispatch').and.callThrough();
  });

  afterEach(() => {
    destroy$.next(true);
    destroy$.unsubscribe();
  });

  describe('getObjectMarks', () => {
    it('should return the object marks', () => {
      let result;
      let selectors: ObjectMarkSelectors = TestBed.get(ObjectMarkSelectors);

      store
        .select(selectors.getObjectMarks(EObjectMarkContext.bookmarkedHike))
        .pipe(takeUntil(destroy$))
        .subscribe(_data => (result = _data));

      expect(result).toEqual([]);

      store.dispatch(new Actions.ContextLoaded(EObjectMarkContext.bookmarkedHike, contexts));

      expect(result).toEqual(contexts);
    });
  });

  describe('getObjectMarkObject', () => {
    it('should return the object mark object', () => {
      let result;
      let selectors: ObjectMarkSelectors = TestBed.get(ObjectMarkSelectors);

      store
        .select(selectors.getObjectMarkObject(EObjectMarkContext.bookmarkedHike, contexts[0]))
        .pipe(takeUntil(destroy$))
        .subscribe(_data => (result = _data));

      expect(result).toEqual(undefined);

      store.dispatch(new Actions.ContextLoaded(EObjectMarkContext.bookmarkedHike, contexts));

      expect(result).toEqual(contexts[0]);
    });

    it('should return undefined when not found', () => {
      let result;
      let selectors: ObjectMarkSelectors = TestBed.get(ObjectMarkSelectors);

      store
        .select(selectors.getObjectMarkObject(EObjectMarkContext.bookmarkedHike, 'notfound'))
        .pipe(takeUntil(destroy$))
        .subscribe(_data => (result = _data));

      expect(result).toEqual(undefined);

      store.dispatch(new Actions.ContextLoaded(EObjectMarkContext.bookmarkedHike, contexts));

      expect(result).toEqual(undefined);
    });
  });

  describe('isObjectMarked', () => {
    it('should return true when marked', () => {
      let result;
      let selectors: ObjectMarkSelectors = TestBed.get(ObjectMarkSelectors);

      store
        .select(selectors.isObjectMarked(EObjectMarkContext.bookmarkedHike, contexts[0]))
        .pipe(takeUntil(destroy$))
        .subscribe(_data => (result = _data));

      expect(result).toEqual(false);

      store.dispatch(new Actions.ContextLoaded(EObjectMarkContext.bookmarkedHike, contexts));

      expect(result).toEqual(true);
    });

    it('should return false when not found', () => {
      let result;
      let selectors: ObjectMarkSelectors = TestBed.get(ObjectMarkSelectors);

      store
        .select(selectors.isObjectMarked(EObjectMarkContext.bookmarkedHike, 'notfound'))
        .pipe(takeUntil(destroy$))
        .subscribe(_data => (result = _data));

      expect(result).toEqual(false);

      store.dispatch(new Actions.ContextLoaded(EObjectMarkContext.bookmarkedHike, contexts));

      expect(result).toEqual(false);
    });
  });

  describe('getObjectMarkContext', () => {
    it('should return the context', () => {
      let result;
      let selectors: ObjectMarkSelectors = TestBed.get(ObjectMarkSelectors);

      store
        .select(selectors.getObjectMarkContext(EObjectMarkContext.bookmarkedHike))
        .pipe(takeUntil(destroy$))
        .subscribe(_data => (result = _data));

      expect(result).toEqual(undefined);
      store.dispatch(new Actions.LoadContext(EObjectMarkContext.bookmarkedHike));
      store.dispatch(new Actions.ContextLoaded(EObjectMarkContext.bookmarkedHike, contexts));

      expect(result).toEqual(
        jasmine.objectContaining({
          id: EObjectMarkContext.bookmarkedHike,
          loaded: true,
          loading: false
        })
      );
    });
  });
});
