import { TestBed } from '@angular/core/testing';
import { EffectsModule } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { StoreModule } from '@ngrx/store';

import { DeepstreamService } from '@bit/garlictech.angular-features.common.deepstream-ngx';
import { Observable, of } from 'rxjs';

import * as uuid from 'uuid/v1';

import { cold, hot, Scheduler } from 'jest-marbles';

import { GeoSearchService } from '../../services';
import * as geoSearchActions from '../actions';
import { GeoSearchEffects } from '../effects';

import { DeepstreamModule } from '../../../deepstream';

describe('GeoSearch effects', () => {
  let actions$: Observable<any>;
  let geoSearchService: GeoSearchService;
  let effects: GeoSearchEffects;
  let results: Array<string>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [StoreModule.forRoot({}), EffectsModule.forRoot([]), DeepstreamModule.forRoot()],
      providers: [
        GeoSearchService,
        GeoSearchEffects,
        provideMockActions(() => actions$),
        {
          provide: DeepstreamService,
          useValue: {}
        }
      ]
    });

    results = [uuid(), uuid()];
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

      actions$ = hot('-a', { a: action });

      expect(effects.searchInBox$).toBeObservable(expected);

      Scheduler.get().flush();

      expect(geoSearchService.searchBox).toHaveBeenCalledWith({
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

      actions$ = hot('-a', { a: action });

      expect(effects.searchInCircle$).toBeObservable(expected);

      Scheduler.get().flush();

      expect(geoSearchService.searchCircle).toHaveBeenCalledWith({
        table: 'test',
        circle: {
          radius: 500,
          center: []
        }
      });
    });
  });
});
