// tslint:disable:no-big-function
import * as _ from 'lodash';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { TestBed } from '@angular/core/testing';
import {
  BackgroundImageData,
  ETextualDescriptionType
} from '@bit/garlictech.angular-features.common.gtrack-interfaces';
import { select, Store, StoreModule } from '@ngrx/store';

import { editedGTrackPoiActions } from '../../actions';
import { editedGTrackPoiReducer, initialEditedGTrackPoiState } from '../../reducer/edited-gtrack-poi';
import { bgImages as bgImageFixtures } from '../../reducer/test/fixtures';
import * as editedGTrackPoiSelectors from '../../selectors/edited-gtrack-poi';
import { EditedGTrackPoiState } from '../../state';

const A_NEW_TRANSLATION = 'A new translation';

describe('Edited GTrackPoi selectors', () => {
  let store: Store<EditedGTrackPoiState>;
  let destroy$: Subject<boolean>;
  let images: Array<BackgroundImageData>;

  beforeEach(() => {
    images = _.cloneDeep(bgImageFixtures);
    destroy$ = new Subject<boolean>();

    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          editedGtrackPoi: editedGTrackPoiReducer
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

  describe('getDescriptions', () => {
    it('should return editedGTrackPoi descriptions', () => {
      let result;

      store
        .pipe(
          select(editedGTrackPoiSelectors.getDescriptions),
          takeUntil(destroy$)
        )
        .subscribe(res => (result = res));

      expect(result).toEqual({
        en_US: {
          title: 'A new poi',
          type: ETextualDescriptionType.markdown
        }
      });

      store.dispatch(
        new editedGTrackPoiActions.AddNewTranslatedPoiDescription('hu_HU', {
          title: A_NEW_TRANSLATION
        })
      );

      expect(result).toEqual({
        en_US: {
          title: 'A new poi',
          type: ETextualDescriptionType.markdown
        },
        hu_HU: { title: A_NEW_TRANSLATION }
      });
    });
  });

  describe('getDirty', () => {
    it('should return editedGTrackPoi dirty value', () => {
      let result;

      store
        .pipe(
          select(editedGTrackPoiSelectors.getDirty),
          takeUntil(destroy$)
        )
        .subscribe(res => (result = res));

      expect(result).toBeFalsy();

      store.dispatch(
        new editedGTrackPoiActions.AddNewTranslatedPoiDescription('hu_HU', {
          title: A_NEW_TRANSLATION
        })
      );
      expect(result).toBeTruthy();
    });
  });

  describe('getBackgroundImages', () => {
    it('should return editedGTrackPoi background images', () => {
      let result;

      store
        .pipe(
          select(editedGTrackPoiSelectors.getBackgroundImages),
          takeUntil(destroy$)
        )
        .subscribe(res => (result = res));

      expect(result).toEqual([]);

      store.dispatch(new editedGTrackPoiActions.AddPoiBackgroundImage(images[0]));
      expect(result).toEqual([images[0]]);
    });
  });

  describe('getBackgroundOriginalUrls', () => {
    it('should return editedGTrackPoi background original urls', () => {
      let result;

      store
        .pipe(
          select(editedGTrackPoiSelectors.getBackgroundOriginalUrls()),
          takeUntil(destroy$)
        )
        .subscribe(res => (result = res));

      expect(result).toEqual([]);

      store.dispatch(new editedGTrackPoiActions.AddPoiBackgroundImage(images[0]));
      expect(result).toEqual(['fakeOriginalUrl']);
    });
  });

  describe('getDescriptionByLang', () => {
    it('should return editedGTrackPoi description by lang', () => {
      let result;

      store
        .pipe(
          select(editedGTrackPoiSelectors.getDescriptionByLang('en_US')),
          takeUntil(destroy$)
        )
        .subscribe(res => (result = res));

      expect(result).toEqual({ title: 'A new poi', type: ETextualDescriptionType.markdown });

      store.dispatch(new editedGTrackPoiActions.AddNewTranslatedPoiDescription('en_US', { title: 'fakeTitle' }));

      expect(result).toEqual({ title: 'fakeTitle' });
    });
  });

  describe('getData', () => {
    it('should return editedGTrackPoi data', () => {
      let result;

      store
        .pipe(
          select(editedGTrackPoiSelectors.getData),
          takeUntil(destroy$)
        )
        .subscribe(error => (result = error));

      expect(result).toEqual(initialEditedGTrackPoiState.data);

      store.dispatch(
        new editedGTrackPoiActions.AddNewTranslatedPoiDescription('hu_HU', {
          title: A_NEW_TRANSLATION
        })
      );

      expect(result).toEqual(
        _.merge({}, initialEditedGTrackPoiState.data, {
          description: {
            hu_HU: {
              title: A_NEW_TRANSLATION
            }
          }
        })
      );
    });
  });

  describe('getWorking', () => {
    it('should return editedGTrackPoi working value', () => {
      let result;

      store
        .pipe(
          select(editedGTrackPoiSelectors.getWorking),
          takeUntil(destroy$)
        )
        .subscribe(res => (result = res));

      expect(result).toBeFalsy();

      store.dispatch(new editedGTrackPoiActions.SavePoi());
      expect(result).toBeTruthy();
    });
  });

  describe('getError', () => {
    it('should return editedGTrackPoi error value', () => {
      let result;

      store
        .pipe(
          select(editedGTrackPoiSelectors.getError),
          takeUntil(destroy$)
        )
        .subscribe(res => (result = res));

      expect(result).toBeFalsy();

      store.dispatch(new editedGTrackPoiActions.PoiSaveFailed('err'));
      expect(result).toBeTruthy();
    });
  });
});
