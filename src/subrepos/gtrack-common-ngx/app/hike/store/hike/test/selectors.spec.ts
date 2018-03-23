import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { APP_BASE_HREF } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Store, StoreModule, combineReducers } from '@ngrx/store';
import { routerReducer, StoreRouterConnectingModule, RouterStateSerializer } from '@ngrx/router-store';
import { IHikeProgramStored } from 'subrepos/provider-client';
import { Subject } from 'rxjs/Subject';

import { hikeReducer } from '../reducer';
import { IHikeState } from '../state';

import * as actions from '../actions';
import { HikeSelectors } from '../selectors';
import { EXTERNAL_HIKE_DEPENDENCIES } from '../../../externals';
import { RouterSelectors, CustomSerializer } from '../../../../router/store';
import { hikeProgramsStored as hikeProgramFixtures, HikeProgramComponent } from './fixtures';
import { HikeProgram } from '../../../services/hike-program';
import { CheckpointService } from '../../../services/checkpoint';

describe('HikeProgram selectors', () => {
  let store: Store<IHikeState>;
  let hikePrograms: HikeProgram[];
  let ids: string[];
  let destroy$: Subject<boolean>;

  beforeEach(() => {
    hikePrograms = hikeProgramFixtures.map(data => new HikeProgram(data, new CheckpointService()));
    ids = hikePrograms.map(hikeProgram => hikeProgram.id);
    destroy$ = new Subject<boolean>();

    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          hike: hikeReducer,
          router: routerReducer
        }),
        RouterModule.forRoot([
          {
            path: '',
            redirectTo: `/hike/${ids[0]}`,
            pathMatch: 'full'
          },
          {
            path: 'hike/:id',
            component: HikeProgramComponent
          }
        ]),
        StoreRouterConnectingModule
      ],
      declarations: [
        HikeProgramComponent
      ],
      providers: [
        RouterSelectors,
        HikeSelectors,
        {
          provide: EXTERNAL_HIKE_DEPENDENCIES,
          useValue: {
            storeDomain: 'hike'
          }
        },
        {
          provide: APP_BASE_HREF,
          useValue: '/'
        },
        {
          provide: RouterStateSerializer,
          useClass: CustomSerializer
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

  describe('getSelectedHike', () => {
    it('should return the active hike program', done => {
      let router: Router = TestBed.get(Router);
      let hikeSelectors: HikeSelectors = TestBed.get(HikeSelectors);
      let result: HikeProgram;

      store
        .select(hikeSelectors.getSelectedHike())
        .takeUntil(destroy$)
        .subscribe(hikeProgram => (result = hikeProgram));

      return router
        .navigateByUrl(`/hike/${ids[0]}`)
        .then(() => {
          store.dispatch(new actions.HikeProgramLoaded(ids[0], hikePrograms[0]));
          expect(result).toEqual(hikePrograms[0]);
          done();
        })
        .catch(done.fail);
    });
  });

  describe('getSelectedHikeLoaded', () => {
    it('should return if the active hike program loaded', done => {
      let router: Router = TestBed.get(Router);
      let hikeSelectors: HikeSelectors = TestBed.get(HikeSelectors);
      let result: boolean;

      store
        .select(hikeSelectors.getSelectedHikeLoaded())
        .takeUntil(destroy$)
        .subscribe(loaded => (result = loaded));

      return router
        .navigateByUrl(`/hike/${ids[0]}`)
        .then(() => {
          store.dispatch(new actions.LoadHikeProgram(ids[0]));
          store.dispatch(new actions.HikeProgramLoaded(ids[0], hikePrograms[0]));
          expect(result).toEqual(true);
          done();
        })
        .catch(done.fail);
    });
  });

});
