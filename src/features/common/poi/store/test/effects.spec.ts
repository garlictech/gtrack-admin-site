import { cold, hot, Scheduler } from 'jest-marbles';
import _zipObject from 'lodash-es/zipObject';
import { Observable, of } from 'rxjs';
import * as uuid from 'uuid/v4';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { DeepstreamModule, DeepstreamService } from '@bit/garlictech.angular-features.common.deepstream-ngx';
import { GeometryService } from '@bit/garlictech.angular-features.common.geometry';
import { GeoSearchService } from '@bit/garlictech.angular-features.common.geosearch';
import { EObjectState, PoiStored } from '@bit/garlictech.angular-features.common.gtrack-interfaces';
import { EffectsModule } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { StoreModule } from '@ngrx/store';

import { PoiService } from '../../services/poi';
import * as poiActions from '../actions';
import { PoiEffects } from '../effects';
import { pois as poiFixtures, poisStored } from './fixtures';

describe('Poi effects', () => {
  let poisMap: {
    [key: string]: PoiStored;
  };

  let pois: PoiStored[];

  let actions$: Observable<any>;
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
      imports: [StoreModule.forRoot({}), EffectsModule.forRoot([]), HttpClientTestingModule, DeepstreamModule],
      providers: [
        PoiService,
        PoiEffects,
        GeometryService,
        GeoSearchService,
        provideMockActions(() => actions$),
        {
          provide: DeepstreamService,
          useValue: {}
        }
      ]
    });

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

      actions$ = hot('-a', { a: action });

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

      actions$ = hot('-a', { a: action });

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

      actions$ = hot('-a', { a: action });

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

      actions$ = hot('-a', { a: action });

      expect(effects.updateState$).toBeObservable(expected);

      Scheduler.get().flush();

      expect(service.updateState).toHaveBeenCalledWith(poiFixtures[0].id, EObjectState.published);
    });
  });
});
