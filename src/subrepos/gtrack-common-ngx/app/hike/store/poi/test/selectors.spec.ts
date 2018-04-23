import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { APP_BASE_HREF } from '@angular/common';
import { Store, StoreModule, combineReducers } from '@ngrx/store';
import { IPoi, IPoiStored } from 'subrepos/provider-client';
import { Subject } from 'rxjs/Subject';
import * as _ from 'lodash';

import { poiReducer } from '../reducer';
import { IPoiState } from '../state';

import * as actions from '../actions';
import { PoiSelectors } from '../selectors';
import { EXTERNAL_POI_DEPENDENCIES } from '../../../externals';
import { poisStored as poiFixtures } from './fixtures';

describe('Poi selectors', () => {
  let store: Store<IPoiState>;
  let pois: IPoiStored[];
  let ids: string[];
  let destroy$: Subject<boolean>;

  beforeEach(() => {
    ids = poiFixtures.map(poi => poi.id);
    pois = poiFixtures.map(data => data);
    destroy$ = new Subject<boolean>();

    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          poi: poiReducer
        })
      ],
      providers: [
        PoiSelectors,
        {
          provide: EXTERNAL_POI_DEPENDENCIES,
          useValue: {
            storeDomain: 'poi'
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

  describe('getPoiIds', () => {
    it('should return all poi ids', () => {
      let result;
      let poiSelectors: PoiSelectors = TestBed.get(PoiSelectors);

      store
        .select(poiSelectors.getPoiIds)
        .takeUntil(destroy$)
        .subscribe(_ids => (result = _ids));

      expect(result).toEqual([]);

      store.dispatch(new actions.AllPoiLoaded(ids, pois));
      expect(result).toEqual(ids);
    });
  });

  describe('getAllPois', () => {
    it('should return all pois', () => {
      let result;
      let poiSelectors: PoiSelectors = TestBed.get(PoiSelectors);

      store
        .select(poiSelectors.getAllPois)
        .takeUntil(destroy$)
        .subscribe(_pois => (result = _pois));

      expect(result).toEqual([]);

      store.dispatch(new actions.AllPoiLoaded(ids, pois));
      expect(result).toEqual(pois);
    });
  });

  describe('getAllPoiEntities', () => {
    it('should return all pois with ids', () => {
      let result;
      let poiSelectors: PoiSelectors = TestBed.get(PoiSelectors);

      store
        .select(poiSelectors.getAllPoiEntities)
        .takeUntil(destroy$)
        .subscribe(_pois => (result = _pois));

      expect(result).toEqual({});

      store.dispatch(new actions.AllPoiLoaded(ids, pois));
      expect(_.values(result)).toEqual(pois);
      expect(_.keys(result)).toEqual(ids);
    });
  });

  describe('getPoi', () => {
    it('should return poi by id', () => {
      let result;
      let poiSelectors: PoiSelectors = TestBed.get(PoiSelectors);

      store
        .select(poiSelectors.getPoi(ids[0]))
        .takeUntil(destroy$)
        .subscribe(poi => (result = poi));

      expect(result).toEqual(undefined);

      store.dispatch(new actions.AllPoiLoaded(ids, pois));
      expect(result).toEqual(pois[0]);
    });
  });

  describe('getPois', () => {
    it('should return pois by id', () => {
      let result;
      let poiSelectors: PoiSelectors = TestBed.get(PoiSelectors);

      store
        .select(poiSelectors.getPois(ids))
        .takeUntil(destroy$)
        .subscribe(_pois => (result = _pois));

      expect(result).toEqual([]);

      store.dispatch(new actions.AllPoiLoaded(ids, pois));
      expect(result).toEqual(pois);
    });
  });

  describe('getPoiEntities', () => {
    it('should return pois as entities by id', () => {
      let result;
      let poiSelectors: PoiSelectors = TestBed.get(PoiSelectors);

      store
        .select(poiSelectors.getPoiEntities(ids))
        .takeUntil(destroy$)
        .subscribe(_pois => (result = _pois));

      expect(result).toEqual({});

      store.dispatch(new actions.AllPoiLoaded(ids, pois));
      expect(result).toEqual(_.zipObject(ids, pois));
    });
  });

});
