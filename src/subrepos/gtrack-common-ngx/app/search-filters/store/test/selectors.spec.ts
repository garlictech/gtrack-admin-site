import { TestBed } from '@angular/core/testing';
import { Store, StoreModule, select } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import * as actions from '../actions';
import { searchFiltersReducer, initialState } from '../reducer';
import { SearchFilters } from '../../interfaces';
import { SearchFiltersSelectors } from '../selectors';
import { EXTERNAL_SEARCH_FILTERS_DEPENDENCIES } from '../../externals';

import 'rxjs/add/operator/takeUntil';

describe('SearchFilters selectors', () => {
  let store: Store<SearchFilters>;
  let destroy$: Subject<boolean>;

  beforeEach(() => {
    destroy$ = new Subject<boolean>();
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          searchFilters: searchFiltersReducer
        })
      ],
      providers: [
        SearchFiltersSelectors,
        {
          provide: EXTERNAL_SEARCH_FILTERS_DEPENDENCIES,
          useValue: {
            storeDomain: 'searchFilters'
          }
        }
      ]
    });

    store = TestBed.get(Store);
    spyOn(store, 'dispatch').and.callThrough();
  });

  afterEach(() => {
    destroy$.next(true);
    destroy$.unsubscribe();
  });

  describe('getFilters', () => {
    it('should return the filters', () => {
      let results;
      const selectors: SearchFiltersSelectors = TestBed.get(SearchFiltersSelectors);

      store
        .pipe(
          select(selectors.getFilters),
          takeUntil(destroy$)
        )
        .subscribe(filters => (results = filters));

      store.dispatch(
        new actions.ChangeFilters({
          difficulty: [4, 6]
        })
      );

      expect(results).toEqual({
        ...initialState,
        difficulty: [4, 6]
      });
    });
  });

  describe('getFilter', () => {
    it('should return a filter', () => {
      let result;
      const selectors: SearchFiltersSelectors = TestBed.get(SearchFiltersSelectors);

      store
        .pipe(
          select(selectors.getFilter('radius')),
          takeUntil(destroy$)
        )
        .subscribe(filter => (result = filter));

      store.dispatch(
        new actions.ChangeFilters({
          radius: 200
        })
      );

      expect(result).toEqual(200);
    });
  });
});
