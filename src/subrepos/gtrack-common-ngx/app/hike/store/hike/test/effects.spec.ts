import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { EffectsModule } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { StoreModule } from '@ngrx/store';

import { HikeProgramStored, EObjectState } from '@features/common/gtrack-interfaces';
import { DeepstreamService } from '@features/common/deepstream-ngx';

import _zipObject from 'lodash-es/zipObject';

import * as uuid from 'uuid/v1';

import { hot, cold, Scheduler } from 'jest-marbles';

import * as hikeProgramActions from '../actions';
import { HikeEffects } from '../effects';
import { HikeSelectors } from '../selectors';
import { HikeProgramService } from '../../../services/hike-program';
import { DeepstreamModule } from '../../../../deepstream';
import { CheckpointService } from '../../../services/checkpoint';

import { Observable, of } from 'rxjs';
import { hikeProgramsStored } from '../../../testing/fixtures';
import { HikeState } from '../state';
import { hikeReducer } from '../reducer';
import { GeoSearchSelectors } from '../../../../geosearch';
import { SearchFiltersSelectors } from '../../../../search-filters';
import { EXTERNAL_HIKE_DEPENDENCIES } from '../../../externals/hike';

describe('HikeProgram effects', () => {
  let hikeProgramsMap: {
    [key: string]: HikeProgramStored;
  };

  let hikePrograms: HikeProgramStored[];

  let actions$: Observable<any>;
  let hikeProgramService: HikeProgramService;
  let checkpointService: CheckpointService;
  let effects: HikeEffects;

  let ids: string[];
  let newId: string;

  beforeEach(() => {
    checkpointService = new CheckpointService();
    ids = hikeProgramsStored.map(hikeProgram => hikeProgram.id);
    hikeProgramsMap = _zipObject(ids, hikeProgramsStored);
    newId = uuid();
    hikePrograms = [...hikeProgramsStored];

    const contextEntities = {};
    const hikeProgramEntities = {};

    contextEntities[hikePrograms[0].id] = {
      loading: false,
      loaded: true
    };

    hikeProgramEntities[hikePrograms[0].id] = hikePrograms[0];

    const state: HikeState = {
      contexts: {
        ids: [hikePrograms[0].id],
        entities: contextEntities
      },
      hikes: {
        ids: [hikePrograms[0].id],
        entities: hikeProgramEntities
      }
    };

    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot(
          {
            hike: hikeReducer
          },
          {
            initialState: {
              hike: state
            }
          }
        ),
        EffectsModule.forRoot([]),
        HttpClientTestingModule,
        DeepstreamModule.forRoot()
      ],
      providers: [
        HikeProgramService,
        HikeEffects,
        provideMockActions(() => actions$),
        {
          provide: DeepstreamService,
          useValue: {}
        },
        {
          provide: GeoSearchSelectors,
          useValue: {}
        },
        {
          provide: SearchFiltersSelectors,
          useValue: {}
        },
        {
          provide: EXTERNAL_HIKE_DEPENDENCIES,
          useValue: {
            storeDomain: 'hike'
          }
        },
        HikeSelectors,
        CheckpointService
      ]
    });

    hikeProgramService = TestBed.get(HikeProgramService);
    effects = TestBed.get(HikeEffects);
    checkpointService = TestBed.get(CheckpointService);

    spyOn(hikeProgramService, 'get').and.callFake(id => of(hikeProgramsMap[id]));
    spyOn(hikeProgramService, 'reverse').and.callFake(hikeProgram => ({
      ...hikeProgramsMap[hikeProgram.id],
      reversed: true
    }));

    spyOn(hikeProgramService, 'query').and.returnValue(of(hikePrograms));
    spyOn(hikeProgramService, 'save').and.returnValue(
      of({
        id: newId
      })
    );

    spyOn(hikeProgramService, 'updateState').and.returnValue(
      of({
        success: true
      })
    );
  });

  describe('loadHike$', () => {
    it('should return a HikeProgram from HikeProgramLoaded', () => {
      const action = new hikeProgramActions.LoadHikeProgram(ids[0]);
      const completion = new hikeProgramActions.HikeProgramLoaded(ids[0], hikePrograms[0]);
      const expected = cold('-b', { b: completion });

      actions$ = hot('-a', { a: action });

      expect(effects.loadHike$).toBeObservable(expected);

      Scheduler.get().flush();

      expect(hikeProgramService.get).toHaveBeenCalledWith(ids[0]);
    });
  });

  describe('reverseHike$', () => {
    it('should return a reversed HikeProgram from HikeProgramReversed', () => {
      const action = new hikeProgramActions.ReverseHikeProgram(ids[0]);
      const completion = new hikeProgramActions.HikeProgramReversed(ids[0], {
        ...hikePrograms[0],
        reversed: true
      });

      const expected = cold('-b', { b: completion });

      actions$ = hot('-a', { a: action });

      expect(effects.reverseHike$).toBeObservable(expected);

      Scheduler.get().flush();

      expect(hikeProgramService.reverse).toHaveBeenCalledWith(hikePrograms[0]);
    });
  });

  describe('loadHikes$', () => {
    it('should return all the HikePrograms from AllHikeProgramsLoaded', () => {
      const action = new hikeProgramActions.LoadHikePrograms();
      const completion = new hikeProgramActions.AllHikeProgramsLoaded(ids, hikePrograms);
      const expected = cold('-b', { b: completion });

      actions$ = hot('-a', { a: action });

      expect(effects.loadHikes$).toBeObservable(expected);

      Scheduler.get().flush();

      expect(hikeProgramService.query).toHaveBeenCalled();
    });
  });

  describe('updateState$', () => {
    it('should return a LoadHikeProgram action', () => {
      const action = new hikeProgramActions.UpdateHikeProgramState(ids[0], EObjectState.published);
      const completion = new hikeProgramActions.LoadHikeProgram(ids[0]);
      const expected = cold('-b', { b: completion });

      actions$ = hot('-a', { a: action });

      expect(effects.updateState$).toBeObservable(expected);

      Scheduler.get().flush();

      expect(hikeProgramService.updateState).toHaveBeenCalledWith(ids[0], EObjectState.published);
    });
  });
});
