import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { APP_BASE_HREF } from '@angular/common';
import { Store, StoreModule, combineReducers } from '@ngrx/store';
import { IHikeProgramStored } from 'subrepos/provider-client';
import { Subject } from 'rxjs/Subject';

import { hikeReducer } from '../reducer';
import { IHikeState } from '../state';

import * as actions from '../actions';
import { HikeSelectors } from '../selectors';
import { EXTERNAL_HIKE_DEPENDENCIES } from '../../../externals';
import { hikeProgramsStored as hikeProgramFixtures, HikeProgramComponent } from './fixtures';
import { CheckpointService } from '../../../services/checkpoint';

import {
  EXTERNAL_SEARCH_FILTERS_DEPENDENCIES,
  SearchFiltersSelectors
} from '../../../../search-filters';

import {
  EXTERNAL_GEO_SEARCH_DEPENDENCIES,
  GeoSearchSelectors
} from '../../../../geosearch';

describe('HikeProgram selectors', () => {
  let store: Store<IHikeState>;
  let hikePrograms: IHikeProgramStored[];
  let ids: string[];
  let destroy$: Subject<boolean>;

  beforeEach(() => {
    hikePrograms = [ ... hikeProgramFixtures ];
    ids = hikePrograms.map(hikeProgram => hikeProgram.id);
    destroy$ = new Subject<boolean>();

    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          hike: hikeReducer
        })
      ],
      declarations: [
        HikeProgramComponent
      ],
      providers: [
        HikeSelectors,
        GeoSearchSelectors,
        SearchFiltersSelectors,
        {
          provide: EXTERNAL_HIKE_DEPENDENCIES,
          useValue: {
            storeDomain: 'hike'
          }
        },
        {
          provide: EXTERNAL_GEO_SEARCH_DEPENDENCIES,
          useValue: {
            storeDomain: 'geoSearch'
          }
        },
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

  describe('getHikeIds', () => {
    it('should return all hike program ids', () => {
      let result;
      let hikeSelectors: HikeSelectors = TestBed.get(HikeSelectors);

      store
        .select(hikeSelectors.getHikeIds)
        .takeUntil(destroy$)
        .subscribe(_ids => (result = _ids));

      expect(result).toEqual([]);

      store.dispatch(new actions.AllHikeProgramsLoaded(ids, hikePrograms));
      expect(result).toEqual(ids);
    });
  });

  describe('getAllHikes', () => {
    it('should return all hike program', () => {
      let result;
      let hikeSelectors: HikeSelectors = TestBed.get(HikeSelectors);

      store
        .select(hikeSelectors.getAllHikes)
        .takeUntil(destroy$)
        .subscribe(_hikePrograms => (result = _hikePrograms));

      expect(result).toEqual([]);

      store.dispatch(new actions.AllHikeProgramsLoaded(ids, hikePrograms));
      expect(result).toEqual(hikePrograms);
    });
  });
});
