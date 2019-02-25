import { TestBed } from '@angular/core/testing';
import { Store, StoreModule, select } from '@ngrx/store';
import { PoiStored } from '@bit/garlictech.angular-features.common.gtrack-interfaces';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import _get from 'lodash-es/get';
import _values from 'lodash-es/values';
import _keys from 'lodash-es/keys';
import _zipObject from 'lodash-es/zipObject';

import { poiReducer } from '../reducer';
import { PoiState } from '../state';

import * as actions from '../actions';
import { PoiSelectors } from '../selectors';
import { EXTERNAL_POI_DEPENDENCIES } from '../../../externals';
import { poisStored as poiFixtures } from './fixtures';

describe('Poi selectors', () => {
  let store: Store<PoiState>;
  let poisData: PoiStored[];
  let pois: PoiStored[];
  let ids: string[];
  let destroy$: Subject<boolean>;

  beforeEach(() => {
    poisData = [...poiFixtures];
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
      const poiSelectors: PoiSelectors = TestBed.get(PoiSelectors);

      store
        .pipe(
          select(poiSelectors.getPoiIds),
          takeUntil(destroy$)
        )
        .subscribe(_ids => (result = _ids));

      expect(result).toEqual([]);

      store.dispatch(new actions.AllPoiLoaded(ids, pois));
      expect(result).toEqual(ids);
    });
  });

  describe('getAllPois', () => {
    it('should return all pois', () => {
      let result;
      const poiSelectors: PoiSelectors = TestBed.get(PoiSelectors);

      store
        .pipe(
          select(poiSelectors.getAllPois),
          takeUntil(destroy$)
        )
        .subscribe(_pois => (result = _pois));

      expect(result).toEqual([]);

      store.dispatch(new actions.AllPoiLoaded(ids, pois));
      expect(result).toEqual(pois);
    });
  });

  describe('getAllPoiEntities', () => {
    it('should return all pois with ids', () => {
      let result;
      const poiSelectors: PoiSelectors = TestBed.get(PoiSelectors);

      store
        .pipe(
          select(poiSelectors.getAllPoiEntities),
          takeUntil(destroy$)
        )
        .subscribe(_pois => (result = _pois));

      expect(result).toEqual({});

      store.dispatch(new actions.AllPoiLoaded(ids, pois));
      expect(_values(result)).toEqual(pois);
      expect(_keys(result)).toEqual(ids);
    });
  });

  describe('getPoi', () => {
    it('should return poi by id', () => {
      let result;
      const poiSelectors: PoiSelectors = TestBed.get(PoiSelectors);

      store
        .pipe(
          select(poiSelectors.getPoi(ids[0])),
          takeUntil(destroy$)
        )
        .subscribe(poi => (result = poi));

      expect(result).toEqual(undefined);

      store.dispatch(new actions.AllPoiLoaded(ids, pois));
      expect(result).toEqual(pois[0]);
    });
  });

  describe('getAllPoisCount', () => {
    it('should return pois count', () => {
      let result;
      const poiSelectors: PoiSelectors = TestBed.get(PoiSelectors);

      store
        .pipe(
          select(poiSelectors.getAllPois),
          takeUntil(destroy$)
        )
        .subscribe(_pois => (result = _pois.length));

      expect(result).toEqual(0);

      store.dispatch(new actions.AllPoiLoaded(ids, pois));
      expect(result).toEqual(pois.length);
    });
  });

  describe('getPois', () => {
    it('should return pois by id', () => {
      let result;
      const poiSelectors: PoiSelectors = TestBed.get(PoiSelectors);

      store
        .pipe(
          select(poiSelectors.getPois(ids)),
          takeUntil(destroy$)
        )
        .subscribe(_pois => (result = _pois));

      expect(result).toEqual([]);

      store.dispatch(new actions.AllPoiLoaded(ids, pois));
      expect(result).toEqual(pois);
    });
  });

  describe('getPoiEntities', () => {
    it('should return pois as entities by id', () => {
      let result;
      const poiSelectors: PoiSelectors = TestBed.get(PoiSelectors);

      store
        .pipe(
          select(poiSelectors.getPoiEntities(ids)),
          takeUntil(destroy$)
        )
        .subscribe(_pois => (result = _pois));

      expect(result).toEqual({});

      store.dispatch(new actions.AllPoiLoaded(ids, pois));
      expect(result).toEqual(_zipObject(ids, pois));
    });
  });
});
