// tslint:disable:no-big-function
import * as _ from 'lodash';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { TestBed } from '@angular/core/testing';
import { select, Store, StoreModule } from '@ngrx/store';

import { EXTERNAL_POI_DEPENDENCIES, poiReducer, PoiSelectors } from '../../../../subrepos/gtrack-common-ngx';
import {
  BackgroundImageData,
  EObjectState,
  ETextualDescriptionType,
  HikeProgramStop
} from '../../../../subrepos/provider-client';
import { ExternalPoi } from '../../../shared/interfaces';
import { commonPoiActions, editedHikeProgramActions } from '../../actions';
import { editedHikeProgramReducer, initialEditedHikeProgramState } from '../../reducer/edited-hike-program';
import { bgImages as bgImageFixtures, pois as poiFixtures, stops as stopsFixtures } from '../../reducer/test/fixtures';
import * as editedHikeProgramSelectors from '../../selectors/edited-hike-program';
import { EditedHikeProgramState } from '../../state';

const A_NEW_TRANSLATION = 'A new translation';

describe('Edited HikeProgram selectors', () => {
  let store: Store<EditedHikeProgramState>;
  let destroy$: Subject<boolean>;
  let images: Array<BackgroundImageData>;
  let pois: Array<ExternalPoi>;
  let stops: Array<HikeProgramStop>;
  let ids: Array<string>;

  beforeEach(() => {
    images = _.cloneDeep(bgImageFixtures);
    pois = _.cloneDeep(poiFixtures);
    stops = _.cloneDeep(stopsFixtures);
    ids = pois.map(poi => poi.id);
    destroy$ = new Subject<boolean>();

    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          editedHikeProgram: editedHikeProgramReducer,
          pois: poiReducer
        })
      ],
      providers: [
        PoiSelectors,
        {
          provide: EXTERNAL_POI_DEPENDENCIES,
          useValue: {
            storeDomain: 'pois'
          }
        }
      ]
    });

    store = TestBed.get(Store);
    spyOn(store, 'dispatch').and.callThrough();
  });

  afterEach(() => {
    destroy$.next(true);
    destroy$.unsubscribe();
  });

  describe('getData', () => {
    it('should return editedHikeProgram data', () => {
      let result;

      store
        .pipe(
          select(editedHikeProgramSelectors.getData),
          takeUntil(destroy$)
        )
        .subscribe(error => (result = error));

      expect(result).toEqual(initialEditedHikeProgramState.data);

      store.dispatch(
        new editedHikeProgramActions.AddNewTranslatedHikeProgramDescription('hu_HU', {
          title: A_NEW_TRANSLATION
        })
      );

      expect(result).toEqual(
        _.merge({}, initialEditedHikeProgramState.data, {
          description: {
            hu_HU: {
              title: A_NEW_TRANSLATION
            }
          }
        })
      );
    });
  });

  describe('getHikeId', () => {
    it('should return editedGTrackPoi hikeId', () => {
      let result;

      store
        .pipe(
          select(editedHikeProgramSelectors.getHikeId),
          takeUntil(destroy$)
        )
        .subscribe(error => (result = error));

      expect(result).toEqual('');

      store.dispatch(
        new editedHikeProgramActions.AddHikeProgramDetails(
          {
            id: 'fakeId'
          },
          true
        )
      );

      expect(result).toEqual('fakeId');
    });
  });

  describe('getRouteId', () => {
    it('should return editedGTrackPoi routeId', () => {
      let result;

      store
        .pipe(
          select(editedHikeProgramSelectors.getRouteId),
          takeUntil(destroy$)
        )
        .subscribe(error => (result = error));

      expect(result).toEqual('');

      store.dispatch(
        new editedHikeProgramActions.AddHikeProgramDetails(
          {
            routeId: 'fakeId'
          },
          true
        )
      );

      expect(result).toEqual('fakeId');
    });
  });

  describe('getPoiIds', () => {
    it('should return editedGTrackPoi poiIds', () => {
      let result;

      store
        .pipe(
          select(editedHikeProgramSelectors.getPoiIds),
          takeUntil(destroy$)
        )
        .subscribe(error => (result = error));

      expect(result).toEqual([]);

      store.dispatch(new editedHikeProgramActions.SetStops(stops));

      expect(result).toEqual(['1', '2']);
    });
  });

  describe('getStops', () => {
    it('should return editedGTrackPoi stops', () => {
      let result;

      store
        .pipe(
          select(editedHikeProgramSelectors.getStops),
          takeUntil(destroy$)
        )
        .subscribe(error => (result = error));

      expect(result).toEqual([]);

      store.dispatch(new editedHikeProgramActions.SetStops(stops));

      expect(result).toEqual(stops);
    });
  });

  describe('getStopsCount', () => {
    it('should return editedGTrackPoi stops count', () => {
      let result;

      store
        .pipe(
          select(editedHikeProgramSelectors.getStopsCount),
          takeUntil(destroy$)
        )
        .subscribe(error => (result = error));

      expect(result).toEqual(0);

      store.dispatch(new editedHikeProgramActions.SetStops(stops));

      expect(result).toEqual(2);
    });
  });

  describe('getDescriptions', () => {
    it('should return editedHikeProgram descriptions', () => {
      let result;

      store
        .pipe(
          select(editedHikeProgramSelectors.getDescriptions),
          takeUntil(destroy$)
        )
        .subscribe(error => (result = error));

      expect(result).toEqual(initialEditedHikeProgramState.data.description);

      store.dispatch(
        new editedHikeProgramActions.AddNewTranslatedHikeProgramDescription('hu_HU', {
          title: A_NEW_TRANSLATION
        })
      );

      expect(result).toEqual(
        _.merge({}, initialEditedHikeProgramState.data.description, {
          hu_HU: {
            title: A_NEW_TRANSLATION
          }
        })
      );
    });
  });

  describe('getDescriptionLangs', () => {
    it('should return editedHikeProgram descriptions', () => {
      let result;

      store
        .pipe(
          select(editedHikeProgramSelectors.getDescriptionLangs),
          takeUntil(destroy$)
        )
        .subscribe(error => (result = error));

      expect(result).toEqual(['en_US']);

      store.dispatch(
        new editedHikeProgramActions.AddNewTranslatedHikeProgramDescription('hu_HU', {
          title: A_NEW_TRANSLATION
        })
      );

      expect(result).toEqual(['en_US', 'hu_HU']);
    });
  });

  describe('getRouteId', () => {
    it('should return editedHikeProgram routeId', () => {
      let result;

      store
        .pipe(
          select(editedHikeProgramSelectors.getState),
          takeUntil(destroy$)
        )
        .subscribe(error => (result = error));

      expect(result).toEqual(EObjectState.draft);
    });
  });

  describe('getBackgroundImages', () => {
    it('should return editedHikeProgram background images', () => {
      let result;

      store
        .pipe(
          select(editedHikeProgramSelectors.getBackgroundImages),
          takeUntil(destroy$)
        )
        .subscribe(res => (result = res));

      expect(result).toEqual([]);

      store.dispatch(new editedHikeProgramActions.AddHikeProgramBackgroundImage(images[0]));
      expect(result).toEqual([images[0]]);
    });
  });

  describe('getDirty', () => {
    it('should return editedHikeProgram dirty value', () => {
      let result;

      store
        .pipe(
          select(editedHikeProgramSelectors.getDirty),
          takeUntil(destroy$)
        )
        .subscribe(res => (result = res));

      expect(result).toBeFalsy();

      store.dispatch(
        new editedHikeProgramActions.AddNewTranslatedHikeProgramDescription('hu_HU', {
          title: A_NEW_TRANSLATION
        })
      );
      expect(result).toBeTruthy();
    });
  });

  describe('getWorking', () => {
    it('should return editedHikeProgram working value', () => {
      let result;

      store
        .pipe(
          select(editedHikeProgramSelectors.getWorking),
          takeUntil(destroy$)
        )
        .subscribe(res => (result = res));

      expect(result).toBeFalsy();

      store.dispatch(new editedHikeProgramActions.SaveHikeProgram());
      expect(result).toBeTruthy();
    });
  });

  describe('getError', () => {
    it('should return editedHikeProgram error value', () => {
      let result;

      store
        .pipe(
          select(editedHikeProgramSelectors.getError),
          takeUntil(destroy$)
        )
        .subscribe(res => (result = res));

      expect(result).toBeFalsy();

      store.dispatch(new editedHikeProgramActions.HikeProgramSaveFailed('err'));
      expect(result).toBeTruthy();
    });
  });

  describe('getHikePois', () => {
    it('should return editedHikeProgram pois', () => {
      let result;
      const poiSelectors: PoiSelectors = TestBed.get(PoiSelectors);

      store.dispatch(
        new commonPoiActions.PoiLoaded(
          ids[0],
          _.merge(pois[0], {
            timestamp: 0,
            state: EObjectState.published
          })
        )
      );

      store
        .select(editedHikeProgramSelectors.getHikePois(poiSelectors.getAllPois))
        .takeUntil(destroy$)
        .subscribe(res => (result = res));

      expect(result).toEqual([]);

      store.dispatch(new editedHikeProgramActions.SetStops(stops));

      expect(result).toEqual([pois[0]]);
    });
  });

  describe('getHikePoisCount', () => {
    it('should return editedHikeProgram pois count', () => {
      let result;
      const poiSelectors: PoiSelectors = TestBed.get(PoiSelectors);

      store.dispatch(
        new commonPoiActions.PoiLoaded(
          ids[0],
          _.merge(pois[0], {
            timestamp: 0,
            state: EObjectState.published
          })
        )
      );

      store
        .select(editedHikeProgramSelectors.getHikePoisCount(poiSelectors.getAllPois))
        .takeUntil(destroy$)
        .subscribe(res => (result = res));

      expect(result).toEqual(0);

      store.dispatch(new editedHikeProgramActions.SetStops(stops));

      expect(result).toEqual(1);
    });
  });

  describe('getStopsWithPoiNames', () => {
    it('should return stops with poi names', () => {
      let result;
      const poiSelectors: PoiSelectors = TestBed.get(PoiSelectors);

      // Load 1 poi
      store.dispatch(
        new commonPoiActions.PoiLoaded(
          ids[0],
          _.merge(pois[0], {
            timestamp: 0,
            state: EObjectState.published
          })
        )
      );

      store
        .select(editedHikeProgramSelectors.getStopsWithPoiNames(poiSelectors.getAllPois))
        .takeUntil(destroy$)
        .subscribe(res => (result = res));

      expect(result).toEqual([]);

      store.dispatch(new editedHikeProgramActions.SetStops(stops));

      // Return with 2 stops, only the 1st contains poi description!
      expect(result).toEqual([
        _.merge(stops[0], {
          description: pois[0].description
        }),
        stops[1]
      ]);
    });
  });

  describe('getBackgroundOriginalUrls', () => {
    it('should return editedHikeProgram background original urls', () => {
      let result;

      store
        .pipe(
          select(editedHikeProgramSelectors.getBackgroundOriginalUrls()),
          takeUntil(destroy$)
        )
        .subscribe(res => (result = res));

      expect(result).toEqual([]);

      store.dispatch(new editedHikeProgramActions.AddHikeProgramBackgroundImage(images[0]));
      expect(result).toEqual(['fakeOriginalUrl']);
    });
  });

  describe('getDescriptionByLang', () => {
    it('should return editedHikeProgram description by lang', () => {
      let result;

      store
        .pipe(
          select(editedHikeProgramSelectors.getDescriptionByLang('en_US')),
          takeUntil(destroy$)
        )
        .subscribe(res => (result = res));

      expect(result).toEqual({
        title: 'A new hike',
        fullDescription: '',
        summary: '',
        type: ETextualDescriptionType.markdown
      });

      store.dispatch(
        new editedHikeProgramActions.AddNewTranslatedHikeProgramDescription('en_US', { title: 'fakeTitle' })
      );

      expect(result).toEqual({ title: 'fakeTitle' });
    });
  });
});
