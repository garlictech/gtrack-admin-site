import { TestBed }  from '@angular/core/testing';
import { Actions, Effect, EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { hot, cold } from 'jasmine-marbles';
import { Observable } from 'rxjs/Observable';

import { UserStatusEffects } from '../effects';
import * as actions from '../actions';
import { LocationService } from '../../services';

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

describe('UserStatusEffects', () => {
  let actions$: TestActions;
  let locationService: LocationService;
  let effects: UserStatusEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({

        }),
        EffectsModule.forRoot([

        ])
      ],
      providers: [
        LocationService,
        UserStatusEffects,
        {
          provide: Actions,
          useFactory: getActions
        }
      ]
    });

    actions$ = TestBed.get(Actions);
    locationService = TestBed.get(LocationService);
    effects = TestBed.get(UserStatusEffects);

    spyOn(locationService, 'requestLocation').and.returnValue(Observable.of([0, 0]));
  });

  describe('requestLocation$', () => {
    it('should request the location', () => {
      const action = new actions.RequestLocation();
      const completion = new actions.LocationRequested([0, 0]);
      const expected = cold('-b', {b: completion});

      actions$.stream = hot('-a', {a: action});

      expect(effects.requestLocation$).toBeObservable(expected);
    });
  });

});
