import * as _ from 'lodash';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { TestBed } from '@angular/core/testing';
import { EPoiImageTypes } from '@bit/garlictech.angular-features.common.gtrack-interfaces';
import { select, Store, StoreModule } from '@ngrx/store';

import { BackgroundImageDataStored } from '../../../shared/interfaces';
import { hikeEditImageActions } from '../../actions';
import { hikeEditImageReducer, imageListInitialContextState } from '../../reducer/hike-edit-image';
import { bgImagesStored as bgImageStoredFixtures } from '../../reducer/test/fixtures';
import * as hikeEditImageSelectors from '../../selectors/hike-edit-image';
import { HikeEditImageState } from '../../state';

describe('HikeEditImage selectors', () => {
  let store: Store<HikeEditImageState>;
  let destroy$: Subject<boolean>;
  let imagesStored: Array<BackgroundImageDataStored>;

  beforeEach(() => {
    imagesStored = _.cloneDeep(bgImageStoredFixtures);
    destroy$ = new Subject<boolean>();

    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          hikeEditImage: hikeEditImageReducer
        })
      ]
    });

    store = TestBed.get(Store);
    spyOn(store, 'dispatch').and.callThrough();
  });

  afterEach(() => {
    destroy$.next(true);
    destroy$.unsubscribe();
  });

  describe('getAllMapillaryImages', () => {
    it('should return mapillary image', () => {
      let result;

      store
        .pipe(
          select(hikeEditImageSelectors.getAllMapillaryImages),
          takeUntil(destroy$)
        )
        .subscribe(res => (result = res));

      expect(result).toEqual([]);

      store.dispatch(new hikeEditImageActions.SetMapillaryImages([imagesStored[0]]));
      expect(result).toEqual([imagesStored[0]]);
    });
  });

  describe('getAllFlickrImages', () => {
    it('should return flickr image', () => {
      let result;

      store
        .pipe(
          select(hikeEditImageSelectors.getAllFlickrImages),
          takeUntil(destroy$)
        )
        .subscribe(res => (result = res));

      expect(result).toEqual([]);

      store.dispatch(new hikeEditImageActions.SetFlickrImages([imagesStored[0]]));
      expect(result).toEqual([imagesStored[0]]);
    });
  });

  describe('getImageMarkerImages', () => {
    it('should return image marker urls', () => {
      let result;

      store
        .pipe(
          select(hikeEditImageSelectors.getImageMarkerImages),
          takeUntil(destroy$)
        )
        .subscribe(res => (result = res));

      expect(result).toEqual([]);

      store.dispatch(new hikeEditImageActions.AddImageMarker(imagesStored[0]));
      expect(result).toEqual([imagesStored[0]]);
    });
  });

  describe('getHikeEditImageContextSelector', () => {
    it('should return mapillary image contexts', () => {
      let result;

      store
        .pipe(
          select(hikeEditImageSelectors.getHikeEditImageContextSelector(EPoiImageTypes.mapillary)),
          takeUntil(destroy$)
        )
        .subscribe(res => (result = res));

      expect(result).toEqual(imageListInitialContextState.mapillary);

      store.dispatch(new hikeEditImageActions.GetMapillaryImages('fakeBounds', 'fakePath'));
      expect(result).toEqual(
        _.merge({}, imageListInitialContextState.mapillary, {
          loading: true
        })
      );
    });
  });

  describe('getHikeEditImageContextPropertySelector', () => {
    it('should return mapillary image context property', () => {
      let result;

      store
        .pipe(
          select(hikeEditImageSelectors.getHikeEditImageContextPropertySelector(EPoiImageTypes.mapillary, 'loading')),
          takeUntil(destroy$)
        )
        .subscribe(res => (result = res));

      expect(result).toBeFalsy();

      store.dispatch(new hikeEditImageActions.GetMapillaryImages('fakeBounds', 'fakePath'));
      expect(result).toBeTruthy();
    });
  });
});
