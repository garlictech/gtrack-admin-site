import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Actions, Effect, EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { IHikeProgramStored, IHikeProgram, EObjectState } from 'subrepos/provider-client';
import { DeepstreamService } from 'subrepos/deepstream-ngx';

import * as _ from 'lodash';
import * as uuid from 'uuid/v1';

import { hot, cold } from 'jest-marbles';

import * as hikeProgramActions from '../actions';
import { HikeEffects } from '../effects';
import { HikeProgramService } from '../../../services/hike-program';
import { DeepstreamModule } from '../../../../deepstream';
import { CheckpointService, Checkpoint } from '../../../services/checkpoint';

import { Observable } from 'rxjs/Observable';
import { hikePrograms as hikeProgramFixtures, hikeProgramsStored } from './fixtures';

export class TestActions extends Actions {
  constructor() {
    super(Observable.empty());
  }

  set stream(source: Observable<any>) {
    this.source = source;
  }
}

export function getActions() {
  return new TestActions();
}

describe('HikeProgram effects', () => {
  let hikeProgramsMap: {
    [key: string]: IHikeProgramStored;
  };

  let hikePrograms: IHikeProgramStored[];

  let actions$: TestActions;
  let hikeProgramService: HikeProgramService;
  let checkpointService: CheckpointService;
  let effects: HikeEffects;

  let ids: string[];
  let newId: string;

  beforeEach(() => {
    checkpointService = new CheckpointService();
    ids = hikeProgramsStored.map(hikeProgram => hikeProgram.id);
    hikeProgramsMap = _.zipObject(ids, hikeProgramsStored);
    newId = uuid();
    hikePrograms = [...hikeProgramsStored];

    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({}),
        EffectsModule.forRoot([]),
        HttpClientTestingModule,
        DeepstreamModule.forRoot()
      ],
      providers: [
        HikeProgramService,
        HikeEffects,
        {
          provide: Actions,
          useFactory: getActions
        },
        {
          provide: DeepstreamService,
          useValue: {}
        },
        CheckpointService
      ]
    });

    actions$ = TestBed.get(Actions);
    hikeProgramService = TestBed.get(HikeProgramService);
    effects = TestBed.get(HikeEffects);
    checkpointService = TestBed.get(CheckpointService);

    spyOn(hikeProgramService, 'get').and.callFake(id => Observable.of(hikeProgramsMap[id]));
    spyOn(hikeProgramService, 'query').and.returnValue(Observable.of(hikePrograms));
    spyOn(hikeProgramService, 'save').and.returnValue(
      Observable.of({
        id: newId
      })
    );

    spyOn(hikeProgramService, 'updateState').and.returnValue(
      Observable.of({
        success: true
      })
    );
  });

  describe('loadHike$', () => {
    it('should return a HikeProgram from HikeProgramLoaded', () => {
      const action = new hikeProgramActions.LoadHikeProgram(ids[0]);
      const completion = new hikeProgramActions.HikeProgramLoaded(ids[0], hikePrograms[0]);
      const expected = cold('-b', { b: completion });

      actions$.stream = hot('-a', { a: action });

      expect(effects.loadHike$).toBeObservable(expected);
    });
  });

  describe('loadHikes$', () => {
    it('should return all the HikePrograms from AllHikeProgramsLoaded', () => {
      const action = new hikeProgramActions.LoadHikePrograms();
      const completion = new hikeProgramActions.AllHikeProgramsLoaded(ids, hikePrograms);
      const expected = cold('-b', { b: completion });

      actions$.stream = hot('-a', { a: action });

      expect(effects.loadHikes$).toBeObservable(expected);
    });
  });

  describe('updateState$', () => {
    it('should return a LoadHikeProgram action', () => {
      const action = new hikeProgramActions.UpdateHikeProgramState(ids[0], EObjectState.published);
      const completion = new hikeProgramActions.LoadHikeProgram(ids[0]);
      const expected = cold('-b', { b: completion });

      actions$.stream = hot('-a', { a: action });

      expect(effects.updateState$).toBeObservable(expected);
    });
  });

  /*
  describe('saveHike$', () => {
    it('should return the id of the saved HikeProgram from HikeProgramSaved', () => {
      const action = new hikeProgramActions.SaveHikeProgram(hikeProgramsStored[0]);
      const completion = new hikeProgramActions.HikeProgramSaved(newId);
      const expected = cold('-b', {b: completion});

      actions$.stream = hot('-a', {a: action});

      expect(effects.saveHike$).toBeObservable(expected);
    });
  });
  */
});
