// tslint:disable:no-unbound-method
import { cold, hot, Scheduler } from 'jest-marbles';
import * as _ from 'lodash';
import { Observable } from 'rxjs';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Router, RouterModule } from '@angular/router';
import { BackgroundImageDataStored } from '@bit/garlictech.angular-features.common.gtrack-interfaces';
import { Actions, EffectsModule } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { StoreModule } from '@ngrx/store';

import { DeepstreamService } from '../../../../subrepos/deepstream-ngx';
import { DeepstreamModule } from '../../../../subrepos/gtrack-common-ngx';
import { FlickrService, MapillaryService, PoiEditorService } from '../../../shared/services';
import { hikeEditImageActions } from '../../actions';
import { bgImagesStored as bgImageStoredFixtures } from '../../reducer/test/fixtures';
import { HikeEditImageEffects } from '../hike-edit-image';
import { mockRouter } from './helpers';

describe('HikeEditImageEffects effects', () => {
  let actions$: Observable<any>;
  let effects: HikeEditImageEffects;
  let mapillaryService: MapillaryService;
  let flickrService: FlickrService;
  let bgImages: Array<BackgroundImageDataStored>;

  beforeEach(() => {
    bgImages = _.cloneDeep(bgImageStoredFixtures);

    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({}),
        EffectsModule.forRoot([HikeEditImageEffects]),
        HttpClientTestingModule,
        DeepstreamModule.forRoot(),
        RouterModule.forRoot([])
      ],
      providers: [
        HikeEditImageEffects,
        MapillaryService,
        FlickrService,
        PoiEditorService,
        provideMockActions(() => actions$),
        {
          provide: DeepstreamService,
          useValue: {}
        },
        {
          provide: Router,
          useValue: mockRouter
        },
        {
          provide: PoiEditorService,
          useValue: {
            organizePoiPhotos: () => []
          }
        }
      ]
    });

    actions$ = TestBed.get(Actions);
    effects = TestBed.get(HikeEditImageEffects);
    mapillaryService = TestBed.get(MapillaryService);
    flickrService = TestBed.get(FlickrService);
  });

  describe('getMapillaryImages$', () => {
    it('should return images observable from getMapillaryImages', () => {
      spyOn(mapillaryService, 'get').and.returnValue(Observable.of(bgImages));

      const action = new hikeEditImageActions.GetMapillaryImages('fakeBounds', 'fakePath');
      const completion = new hikeEditImageActions.SetMapillaryImages(bgImages);
      const expected = cold('-b', { b: completion });

      actions$ = hot('-a', { a: action });

      expect(effects.getMapillaryImages$).toBeObservable(expected);

      Scheduler.get().flush();

      expect(mapillaryService.get).toBeCalledWith('fakeBounds', 'fakePath');
    });
  });

  describe('GetFlickrImages$', () => {
    it('should return images observable from getFlickrImages', () => {
      spyOn(flickrService, 'get').and.returnValue(Observable.of(bgImages));

      const action = new hikeEditImageActions.GetFlickrImages('fakeBounds', 'fakePath');
      const completion = new hikeEditImageActions.SetFlickrImages(bgImages);
      const expected = cold('-b', { b: completion });

      actions$ = hot('-a', { a: action });

      expect(effects.getFlickrImages$).toBeObservable(expected);

      Scheduler.get().flush();

      expect(flickrService.get).toBeCalledWith('fakeBounds', 'fakePath');
    });
  });
});
