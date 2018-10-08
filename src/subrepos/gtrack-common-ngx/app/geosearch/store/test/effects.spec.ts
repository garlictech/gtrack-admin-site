import { TestBed } from '@angular/core/testing';
import { Actions, EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { DeepstreamService } from 'subrepos/deepstream-ngx';
import { Observable, EMPTY, of } from 'rxjs';

import * as uuid from 'uuid/v1';

import { hot, cold, Scheduler } from 'jest-marbles';

import { GeoSearchEffects } from '../effects';
import * as geoSearchActions from '../actions';
import { GeoSearchService } from '../../services';

import { DeepstreamModule } from '../../../deepstream';

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

describe('GeoSearch effects', () => {
  let actions$: TestActions;
  let geoSearchService: GeoSearchService;
  let effects: GeoSearchEffects;
  let results: string[];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({}),
        EffectsModule.forRoot([]),
        DeepstreamModule.forRoot()
      ],
      providers: [
        GeoSearchService,
        GeoSearchEffects,
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

    results = [uuid(), uuid()];

    actions$ = TestBed.get(Actions);
    geoSearchService = TestBed.get(GeoSearchService);
    effects = TestBed.get(GeoSearchEffects);

    spyOn(geoSearchService, 'searchBox').and.returnValue(of(results));
    spyOn(geoSearchService, 'searchCircle').and.returnValue(of(results));
  });

  describe('searchInBox$', () => {
    it('should return the search results from GeoSearchComplete', () => {
      const context = uuid();
      const action = new geoSearchActions.SearchInBox(
        {
          table: 'test',
          box: {
            type: 'Polygon',
            coordinates: [[]]
          }
        },
        context
      );

      const completion = new geoSearchActions.GeoSearchComplete(results, context);
      const expected = cold('-b', { b: completion });

      actions$.stream = hot('-a', { a: action });

      expect(effects.searchInBox$).toBeObservable(expected);

      Scheduler.get().flush();

      expect(geoSearchService.searchBox).toHaveBeenCalledWith(        {
        table: 'test',
        box: {
          type: 'Polygon',
          coordinates: [[]]
        }
      });
    });
  });

  describe('searchInCircle$', () => {
    it('should return the search results from GeoSearchComplete', () => {
      const context = uuid();
      const action = new geoSearchActions.SearchInCircle(
        {
          table: 'test',
          circle: {
            radius: 500,
            center: []
          }
        },
        context
      );

      const completion = new geoSearchActions.GeoSearchComplete(results, context);
      const expected = cold('-b', { b: completion });

      actions$.stream = hot('-a', { a: action });

      expect(effects.searchInCircle$).toBeObservable(expected);

      Scheduler.get().flush();

      expect(geoSearchService.searchCircle).toHaveBeenCalledWith(
        {
          table: 'test',
          circle: {
            radius: 500,
            center: []
          }
        }
      );
    });
  });
});
