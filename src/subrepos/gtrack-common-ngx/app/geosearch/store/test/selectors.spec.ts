import { TestBed } from '@angular/core/testing';
import { select, Store, StoreModule } from '@ngrx/store';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { geoSearchReducer } from '../reducer';
import { GeoSearchState } from '../state';

import { EXTERNAL_GEO_SEARCH_DEPENDENCIES } from '../../externals';
import * as actions from '../actions';
import { GeoSearchSelectors } from '../selectors';
import { GeoSearchResponseItem } from '../state';
import { searches as fixtures } from './fixtures';

import 'rxjs/add/operator/takeUntil';

describe('GeoSearch selectors', () => {
  let store: Store<GeoSearchState>;
  let searches: Array<GeoSearchResponseItem>;
  let contexts: Array<string>;
  let destroy$: Subject<boolean>;

  beforeEach(() => {
    searches = [...fixtures];
    contexts = searches.map(search => search.id);
    destroy$ = new Subject<boolean>();

    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          geoSearch: geoSearchReducer
        })
      ],
      providers: [
        GeoSearchSelectors,
        {
          provide: EXTERNAL_GEO_SEARCH_DEPENDENCIES,
          useValue: {
            storeDomain: 'geoSearch'
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

  describe('getGeoSearchContexts', () => {
    it('should return all geoSearch ids', () => {
      let result;
      const geoSearchSelectors: GeoSearchSelectors = TestBed.get(GeoSearchSelectors);

      store
        .pipe(
          select(geoSearchSelectors.getGeoSearchContexts),
          takeUntil(destroy$)
        )
        .subscribe(_contexts => (result = _contexts));

      expect(result).toEqual([]);

      store.dispatch(new actions.GeoSearchComplete(searches[0].results, searches[0].id));
      store.dispatch(new actions.GeoSearchComplete(searches[1].results, searches[1].id));

      expect(result).toEqual(contexts);
    });
  });

  describe('getAllGeoSearches', () => {
    it('should return all geoSearches', () => {
      let result;
      const geoSearchSelectors: GeoSearchSelectors = TestBed.get(GeoSearchSelectors);

      store
        .pipe(
          select(geoSearchSelectors.getAllGeoSearches),
          takeUntil(destroy$)
        )
        .subscribe(geoSearches => (result = geoSearches));

      expect(result).toEqual([]);

      store.dispatch(new actions.GeoSearchComplete(searches[0].results, searches[0].id));
      store.dispatch(new actions.GeoSearchComplete(searches[1].results, searches[1].id));

      expect(result).toEqual(searches);
    });
  });

  describe('getGeoSearch', () => {
    it('should return a geoSearch by id', () => {
      let result;
      const geoSearchSelectors: GeoSearchSelectors = TestBed.get(GeoSearchSelectors);

      store
        .pipe(
          select(geoSearchSelectors.getGeoSearch(contexts[0])),
          takeUntil(destroy$)
        )
        .subscribe(geoSearch => (result = geoSearch));

      expect(result).toEqual(undefined);

      store.dispatch(new actions.GeoSearchComplete(searches[0].results, searches[0].id));

      expect(result).toEqual(searches[0]);
    });
  });
});
