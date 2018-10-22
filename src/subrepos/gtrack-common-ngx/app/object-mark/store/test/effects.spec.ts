import { TestBed } from '@angular/core/testing';
import { Actions, EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { EObjectMarkContext } from 'subrepos/provider-client';

import { hot, cold, Scheduler } from 'jest-marbles';

import * as actions from '../actions';
import { ObjectMarkEffects } from '../effects';
import { ObjectMarkService } from '../../services';

import { Observable, EMPTY } from 'rxjs';
import { of } from 'rxjs';

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

describe('ObjectMark effects', () => {
  let actions$: TestActions;
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
        {
          provide: Actions,
          useFactory: getActions
        }
      ]
    });

    actions$ = TestBed.get(Actions);
    effects = TestBed.get(ObjectMarkEffects);
  });

  describe('loadContext$', () => {
    it('should return with a ContextLoaded action', () => {
      const action = new actions.LoadContext(EObjectMarkContext.bookmarkedHike);
      const completion = new actions.ContextLoaded(EObjectMarkContext.bookmarkedHike, testObjectMarks);
      const expected = cold('-b', { b: completion });

      actions$.stream = hot('-a', { a: action });

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

      actions$.stream = hot('-a', { a: action });

      expect(effects.markObject$).toBeObservable(expected);

      Scheduler.get().flush();

      expect(mark).toHaveBeenCalledWith(EObjectMarkContext.bookmarkedHike, {id: 'test3'}, true);
    });
  });
});
