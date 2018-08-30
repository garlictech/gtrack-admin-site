import { TestBed } from '@angular/core/testing';
import { Actions, EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { EObjectMarkContext } from 'subrepos/provider-client';

import * as _ from 'lodash';

import { hot, cold } from 'jest-marbles';

import * as actions from '../actions';
import { ObjectMarkEffects } from '../effects';
import { } from '../selectors';
import { ObjectMarkService } from '../../services';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs';

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

describe('ObjectMark effects', () => {
  let actions$: TestActions;
  let effects: ObjectMarkEffects;

  let testObjectMarks: any[];

  beforeEach(() => {
    testObjectMarks = [
      {
        id: 'test'
      },
      {
        id: 'test2'
      }
    ];

    const loadContext = jasmine.createSpy('loadContext').and.returnValue(of(testObjectMarks));
    const mark = jasmine.createSpy('mark').and.returnValue(of({ success: true }));

    const fakeService = {
      loadContext,
      mark
    };

    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({}),
        EffectsModule.forRoot([])
      ],
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
      const action = new actions.LoadContext(EObjectMarkContext.bookmarkedHike)
      const completion = new actions.ContextLoaded(EObjectMarkContext.bookmarkedHike, testObjectMarks);
      const expected = cold('-b', { b: completion });

      actions$.stream = hot('-a', { a: action });

      expect(effects.loadContext$).toBeObservable(expected);
    })
  });

  describe('markObject$', () => {
    it('should return with an ObjectMarked action', () => {
      const action = new actions.MarkObject(EObjectMarkContext.bookmarkedHike, {
        id: 'test3'
      }, true);

      const completion = new actions.ObjectMarked(EObjectMarkContext.bookmarkedHike, {
        id: 'test3'
      }, true);
      const expected = cold('-b', { b: completion });

      actions$.stream = hot('-a', { a: action });

      expect(effects.markObject$).toBeObservable(expected);
    });
  });

});
