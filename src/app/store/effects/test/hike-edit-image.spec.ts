import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterModule, Router } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { Actions, EffectsModule } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { hot, cold, Scheduler } from 'jest-marbles';
import { DeepstreamService } from '../../../../subrepos/deepstream-ngx';
import { DeepstreamModule } from '../../../../subrepos/gtrack-common-ngx';
import { TestActions, getActions, mockRouter } from './helpers';
import { MapillaryService } from '../../../shared/services';
import { hikeEditImageActions } from '../../actions';
import { IBackgroundImageDataStored } from 'subrepos/provider-client';
import { HikeEditImageEffects } from '../hike-edit-image';

import * as _ from 'lodash';

import {
  bgImagesStored as bgImageStoredFixtures
} from '../../reducer/test/fixtures';

describe('HikeEditImageEffects effects', () => {
  let actions$: TestActions;
  let effects: HikeEditImageEffects;
  let mapillaryService: MapillaryService;
  let bgImages: IBackgroundImageDataStored[];

  beforeEach(() => {
    bgImages = _.cloneDeep(bgImageStoredFixtures);

    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({}),
        EffectsModule.forRoot([
          HikeEditImageEffects
        ]),
        HttpClientTestingModule,
        DeepstreamModule.forRoot(),
        RouterModule.forRoot([])
      ],
      providers: [
        HikeEditImageEffects,
        MapillaryService,
        {
          provide: Actions,
          useFactory: getActions
        },
        {
          provide: DeepstreamService,
          useValue: {}
        },
        {
          provide: Router,
          useValue: mockRouter
        }
      ]
    });

    actions$ = TestBed.get(Actions);
    effects = TestBed.get(HikeEditImageEffects);
    mapillaryService = TestBed.get(MapillaryService);
  });

  describe('getMapillaryImages$', () => {
    it('should return images observable from getMapillaryImages', () => {
      spyOn(mapillaryService, 'get').and.returnValue(Observable.of(bgImages));

      const action = new hikeEditImageActions.GetMapillaryImages('fakeBounds');
      const completion = new hikeEditImageActions.SetMapillaryImages(bgImages);
      const expected = cold('-b', { b: completion });

      actions$.stream = hot('-a', { a: action });

      expect(effects.getMapillaryImages$).toBeObservable(expected);

      Scheduler.get().flush();

      expect(mapillaryService.get).toBeCalledWith('fakeBounds');
    });
  });
});
