import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { TestBed } from '@angular/core/testing';
import { GeoSearchSelectors } from '@bit/garlictech.angular-features.common.geosearch';
import { SearchFiltersSelectors } from '@bit/garlictech.angular-features.common.search-filters';
import { HikeProgramStored } from '@bit/garlictech.angular-features.common.gtrack-interfaces';
import { select, Store, StoreModule } from '@ngrx/store';

import { HikeProgramComponent, hikeProgramsStored as hikeProgramFixtures } from '../../testing/fixtures';
import * as actions from '../actions';
import { hikeReducer } from '../reducer';
import { HikeSelectors } from '../selectors';
import { HikeState } from '../state';

describe('HikeProgram selectors', () => {
  let store: Store<HikeState>;
  let hikePrograms: HikeProgramStored[];
  let ids: string[];
  let destroy$: Subject<boolean>;

  beforeEach(() => {
    hikePrograms = [...hikeProgramFixtures];
    ids = hikePrograms.map(hikeProgram => hikeProgram.id);
    destroy$ = new Subject<boolean>();

    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          hike: hikeReducer
        })
      ],
      declarations: [HikeProgramComponent],
      providers: [HikeSelectors, GeoSearchSelectors, SearchFiltersSelectors]
    });

    store = TestBed.get(Store);
    spyOn(store, 'dispatch').and.callThrough();
  });

  afterEach(() => {
    destroy$.next(true);
    destroy$.unsubscribe();
  });

  describe('getHikeIds', () => {
    it('should return all hike program ids', () => {
      let result;
      const hikeSelectors: HikeSelectors = TestBed.get(HikeSelectors);

      store
        .pipe(
          select(hikeSelectors.getHikeIds),
          takeUntil(destroy$)
        )
        .subscribe(_ids => (result = _ids));

      expect(result).toEqual([]);

      store.dispatch(new actions.AllHikeProgramsLoaded(ids, hikePrograms));
      expect(result).toEqual(ids);
    });
  });

  describe('getAllHikes', () => {
    it('should return all hike program', () => {
      let result;
      const hikeSelectors: HikeSelectors = TestBed.get(HikeSelectors);

      store
        .pipe(
          select(hikeSelectors.getAllHikes),
          takeUntil(destroy$)
        )
        .subscribe(_hikePrograms => (result = _hikePrograms));

      expect(result).toEqual([]);

      store.dispatch(new actions.AllHikeProgramsLoaded(ids, hikePrograms));
      expect(result).toEqual(hikePrograms);
    });
  });
});
