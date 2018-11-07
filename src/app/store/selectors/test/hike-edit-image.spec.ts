import { TestBed } from '@angular/core/testing';
import { Store, StoreModule, select } from '@ngrx/store';
import { HikeEditImageSelectors } from '../hike-edit-image';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { IHikeEditImageState } from '../../state';
import { hikeEditImageActions } from '../../actions';
import { EPoiImageTypes } from '../../../../subrepos/provider-client';
import { hikeEditImageReducer, imageListInitialContextState } from '../../reducer/hike-edit-image';
import { IBackgroundImageDataStored } from '../../../shared/interfaces';

import { bgImagesStored as bgImageStoredFixtures } from '../../reducer/test/fixtures';

import * as _ from 'lodash';

describe('HikeEditImage selectors', () => {
  let store: Store<IHikeEditImageState>;
  let destroy$: Subject<boolean>;
  let imagesStored: IBackgroundImageDataStored[];

  beforeEach(() => {
    imagesStored = _.cloneDeep(bgImageStoredFixtures);
    destroy$ = new Subject<boolean>();

    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          hikeEditImage: hikeEditImageReducer
        })
      ],
      providers: [HikeEditImageSelectors]
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
      const hikeEditImageSelectors: HikeEditImageSelectors = TestBed.get(HikeEditImageSelectors);

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
      const hikeEditImageSelectors: HikeEditImageSelectors = TestBed.get(HikeEditImageSelectors);

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
      const hikeEditImageSelectors: HikeEditImageSelectors = TestBed.get(HikeEditImageSelectors);

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
      const hikeEditImageSelectors: HikeEditImageSelectors = TestBed.get(HikeEditImageSelectors);

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
      const hikeEditImageSelectors: HikeEditImageSelectors = TestBed.get(HikeEditImageSelectors);

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
