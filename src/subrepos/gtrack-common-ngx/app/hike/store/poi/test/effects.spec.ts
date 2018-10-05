import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Actions, EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { IPoiStored, IPoi } from 'subrepos/provider-client';
import { DeepstreamService } from 'subrepos/deepstream-ngx';

import _zipObject from 'lodash-es/zipObject';

import * as uuid from 'uuid/v4';

import { hot, cold, Scheduler } from 'jest-marbles';

import * as poiActions from '../actions';
import { PoiEffects } from '../effects';
import { PoiService } from '../../../services/poi';
import { DeepstreamModule } from '../../../../deepstream';

import { Observable, EMPTY, of } from 'rxjs';
import { pois as poiFixtures, poisStored } from './fixtures';

import { GeometryService } from '../../../services/geometry';
import { GeoSearchService } from '../../../../geosearch';
import { EObjectState } from '../../../../../../provider-client';

export class TestActions extends Actions {
  constructor() {
    super(EMPTY);
  }

  set stream(source: Observable<any>) {
    this.source = source;
  }
}

export function getActions() {
  return new TestActions();
}

describe('Poi effects', () => {
  let poisMap: {
    [key: string]: IPoiStored;
  };

  let pois: IPoiStored[];

  let actions$: TestActions;
  let service: PoiService;
  let effects: PoiEffects;

  let ids: string[];
  let newId: string;

  beforeEach(() => {
    ids = poisStored.map(poi => poi.id);
    poisMap = _zipObject(ids, poisStored);
    pois = poisStored.map(data => data);
    newId = uuid();

    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({}),
        EffectsModule.forRoot([]),
        HttpClientTestingModule,
        DeepstreamModule.forRoot()
      ],
      providers: [
        PoiService,
        PoiEffects,
        GeometryService,
        GeoSearchService,
        {
          provide: Actions,
          useFactory: getActions
        },
        {
          provide: DeepstreamService,
          useValue: {}
        }
      ]
    });

    actions$ = TestBed.get(Actions);
    service = TestBed.get(PoiService);
    effects = TestBed.get(PoiEffects);

    spyOn(service, 'get').and.callFake(id => of(poisMap[id]));
    spyOn(service, 'create').and.returnValue(
      of({
        id: newId
      })
    );
    spyOn(service, 'updateState').and.returnValue(
      of({
        success: true
      })
    );
  });

  describe('loadPoi$', () => {
    it('should return a Poi from PoiLoaded', () => {
      const action = new poiActions.LoadPoi(ids[0]);
      const completion = new poiActions.PoiLoaded(ids[0], pois[0]);
      const expected = cold('-b', { b: completion });

      actions$.stream = hot('-a', { a: action });

      expect(effects.loadPoi$).toBeObservable(expected);

      Scheduler.get().flush();

      expect(service.get).toHaveBeenCalledWith(ids[0]);
    });
  });

  describe('loadPois$', () => {
    it('should return all the Pois from AllPoiLoaded', () => {
      const action = new poiActions.LoadPois(ids);
      const completion = new poiActions.AllPoiLoaded(ids, pois);
      const expected = cold('-b', { b: completion });

      actions$.stream = hot('-a', { a: action });

      expect(effects.loadPois$).toBeObservable(expected);

      Scheduler.get().flush();

      for (const id of ids) {
        expect(service.get).toHaveBeenCalledWith(id);
      }
    });
  });

  describe('savePoi$', () => {
    it('should return the id of the created Poi from PoiCreated', () => {
      const action = new poiActions.SavePoi(poiFixtures[0]);
      const completion = new poiActions.PoiSaved(newId);
      const expected = cold('-b', { b: completion });

      actions$.stream = hot('-a', { a: action });

      expect(effects.savePoi$).toBeObservable(expected);

      Scheduler.get().flush();

      expect(service.create).toHaveBeenCalledWith(poiFixtures[0]);
    });
  });

  describe('updateState$', () => {
    it('should return a LoadPoi action', () => {
      const action = new poiActions.UpdatePoiState(poiFixtures[0].id, EObjectState.published);
      const completion = new poiActions.LoadPoi(poiFixtures[0].id);
      const expected = cold('-b', { b: completion });

      actions$.stream = hot('-a', { a: action });

      expect(effects.updateState$).toBeObservable(expected);

      Scheduler.get().flush();

      expect(service.updateState).toHaveBeenCalledWith(poiFixtures[0].id, EObjectState.published);
    });
  });
});
