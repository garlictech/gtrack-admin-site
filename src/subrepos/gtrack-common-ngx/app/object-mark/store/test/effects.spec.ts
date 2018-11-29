import { TestBed } from '@angular/core/testing';
import { Actions, EffectsModule } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { StoreModule } from '@ngrx/store';

import { EObjectMarkContext } from 'subrepos/provider-client';

import { hot, cold, Scheduler } from 'jest-marbles';

import * as actions from '../actions';
import { ObjectMarkEffects } from '../effects';
import { ObjectMarkService } from '../../services';

import { Observable, EMPTY } from 'rxjs';
import { of } from 'rxjs';

describe('ObjectMark effects', () => {
  let actions$: Observable<any>;
  let effects: ObjectMarkEffects;

  let testObjectMarks: any[];

  let loadContext: jasmine.Spy;
  let mark: jasmine.Spy;

  beforeEach(() => {
    testObjectMarks = [
      {
        id: 'test'
      },
      {
        id: 'test2'
      }
    ];

    loadContext = jasmine.createSpy('loadContext').and.returnValue(of(testObjectMarks));
    mark = jasmine.createSpy('mark').and.returnValue(of({ success: true }));

    const fakeService = {
      loadContext,
      mark
    };

    TestBed.configureTestingModule({
      imports: [StoreModule.forRoot({}), EffectsModule.forRoot([])],
      providers: [
        {
          provide: ObjectMarkService,
          useValue: fakeService
        },
        ObjectMarkEffects,
        provideMockActions(() => actions$)
      ]
    });

    effects = TestBed.get(ObjectMarkEffects);
  });

  describe('loadContext$', () => {
    it('should return with a ContextLoaded action', () => {
      const action = new actions.LoadContext(EObjectMarkContext.bookmarkedHike);
      const completion = new actions.ContextLoaded(EObjectMarkContext.bookmarkedHike, testObjectMarks);
      const expected = cold('-b', { b: completion });

      actions$ = hot('-a', { a: action });

      expect(effects.loadContext$).toBeObservable(expected);

      Scheduler.get().flush();

      expect(loadContext).toHaveBeenCalledWith(EObjectMarkContext.bookmarkedHike);
    });
  });

  describe('markObject$', () => {
    it('should return with an ObjectMarked action', () => {
      const action = new actions.MarkObject(
        EObjectMarkContext.bookmarkedHike,
        {
          id: 'test3'
        },
        true
      );

      const completion = new actions.ObjectMarked(
        EObjectMarkContext.bookmarkedHike,
        {
          id: 'test3'
        },
        true
      );
      const expected = cold('-b', { b: completion });

      actions$ = hot('-a', { a: action });

      expect(effects.markObject$).toBeObservable(expected);

      Scheduler.get().flush();

      expect(mark).toHaveBeenCalledWith(EObjectMarkContext.bookmarkedHike, { id: 'test3' }, true);
    });
  });
});
