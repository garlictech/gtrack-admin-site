import { TestBed } from '@angular/core/testing';
import { Store, StoreModule, select } from '@ngrx/store';
import { EditedHikeProgramSelectors } from '../edited-hike-program';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { IEditedHikeProgramState } from '../../state';
import { editedHikeProgramReducer, initialEditedHikeProgramState } from '../../reducer/edited-hike-program';
import { editedHikeProgramActions, commonPoiActions } from '../../actions';
import { IBackgroundImageData, EObjectState } from '../../../../subrepos/provider-client';
import { PoiSelectors, EXTERNAL_POI_DEPENDENCIES, poiReducer } from '../../../../subrepos/gtrack-common-ngx';

import {
  pois as poiFixtures,
  bgImages as bgImageFixtures
} from '../../reducer/test/fixtures';

import * as _ from 'lodash';
import { IExternalPoi } from '../../../shared/interfaces';

describe('Edited HikeProgram selectors', () => {
  let store: Store<IEditedHikeProgramState>;
  let destroy$: Subject<boolean>;
  let images: IBackgroundImageData[];
  let pois: IExternalPoi[];
  let ids: string[];

  beforeEach(() => {
    images = _.cloneDeep(bgImageFixtures);
    pois = _.cloneDeep(poiFixtures);
    ids = pois.map(poi => poi.id);
    destroy$ = new Subject<boolean>();

    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          editedHikeProgram: editedHikeProgramReducer,
          pois: poiReducer,
        })
      ],
      providers: [
        EditedHikeProgramSelectors,
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
      const editedHikeProgramSelectors: EditedHikeProgramSelectors = TestBed.get(EditedHikeProgramSelectors);

      store
        .pipe(
          select(editedHikeProgramSelectors.getData),
          takeUntil(destroy$)
        )
        .subscribe(error => (result = error));

      expect(result).toEqual(initialEditedHikeProgramState.data);

      store.dispatch(new editedHikeProgramActions.AddNewTranslatedHikeProgramDescription('hu_HU', {
        title: 'A new translation'
      }));

      expect(result).toEqual(_.merge({},
          initialEditedHikeProgramState.data,
          {
            description: {
              hu_HU: {
                title: 'A new translation'
              }
            }
          }
      ));
    });
  });

  describe('getHikeId', () => {
    it('should return editedGTrackPoi hikeId', () => {
      let result;
      const editedHikeProgramSelectors: EditedHikeProgramSelectors = TestBed.get(EditedHikeProgramSelectors);

      store
        .pipe(
          select(editedHikeProgramSelectors.getHikeId),
          takeUntil(destroy$)
        )
        .subscribe(error => (result = error));

      expect(result).toEqual('');

      store.dispatch(new editedHikeProgramActions.AddHikeProgramDetails({
        id: 'fakeId'
      }, true));

      expect(result).toEqual('fakeId');
    });
  });

  describe('getRouteId', () => {
    it('should return editedGTrackPoi routeId', () => {
      let result;
      const editedHikeProgramSelectors: EditedHikeProgramSelectors = TestBed.get(EditedHikeProgramSelectors);

      store
        .pipe(
          select(editedHikeProgramSelectors.getRouteId),
          takeUntil(destroy$)
        )
        .subscribe(error => (result = error));

      expect(result).toEqual('');

      store.dispatch(new editedHikeProgramActions.AddHikeProgramDetails({
        routeId: 'fakeId'
      }, true));

      expect(result).toEqual('fakeId');
    });
  });

  describe('getPoiIds', () => {
    it('should return editedGTrackPoi poiIds', () => {
      let result;
      const editedHikeProgramSelectors: EditedHikeProgramSelectors = TestBed.get(EditedHikeProgramSelectors);

      store
        .pipe(
          select(editedHikeProgramSelectors.getPoiIds),
          takeUntil(destroy$)
        )
        .subscribe(error => (result = error));

      expect(result).toEqual([]);

      store.dispatch(new editedHikeProgramActions.SetStops([
        {
          poiId: 'fakeId1'
        },
        {
          poiId: 'fakeId2'
        },
        {
          prop: 'noFakeId'
        }
      ]));

      expect(result).toEqual(['fakeId1', 'fakeId2']);
    });
  });

  describe('getStops', () => {
    it('should return editedGTrackPoi stops', () => {
      let result;
      const editedHikeProgramSelectors: EditedHikeProgramSelectors = TestBed.get(EditedHikeProgramSelectors);
      const stops = [
        {
          poiId: 'fakeId1'
        }, {
          poiId: 'fakeId2'
        }
      ];

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
      const editedHikeProgramSelectors: EditedHikeProgramSelectors = TestBed.get(EditedHikeProgramSelectors);
      const stops = [
        {
          poiId: 'fakeId1'
        }, {
          poiId: 'fakeId2'
        }
      ];

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
      const editedHikeProgramSelectors: EditedHikeProgramSelectors = TestBed.get(EditedHikeProgramSelectors);

      store
        .pipe(
          select(editedHikeProgramSelectors.getDescriptions),
          takeUntil(destroy$)
        )
        .subscribe(error => (result = error));

      expect(result).toEqual(initialEditedHikeProgramState.data.description);

      store.dispatch(new editedHikeProgramActions.AddNewTranslatedHikeProgramDescription('hu_HU', {
        title: 'A new translation'
      }));

      expect(result).toEqual(_.merge({},
          initialEditedHikeProgramState.data.description,
          {
            hu_HU: {
              title: 'A new translation'
            }
          }
      ));
    });
  });

  describe('getDescriptionLangs', () => {
    it('should return editedHikeProgram descriptions', () => {
      let result;
      const editedHikeProgramSelectors: EditedHikeProgramSelectors = TestBed.get(EditedHikeProgramSelectors);

      store
        .pipe(
          select(editedHikeProgramSelectors.getDescriptionLangs),
          takeUntil(destroy$)
        )
        .subscribe(error => (result = error));

      expect(result).toEqual(['en_US']);

      store.dispatch(new editedHikeProgramActions.AddNewTranslatedHikeProgramDescription('hu_HU', {
        title: 'A new translation'
      }));

      expect(result).toEqual(['en_US', 'hu_HU']);
    });
  });

  describe('getRouteId', () => {
    it('should return editedHikeProgram routeId', () => {
      let result;
      const editedHikeProgramSelectors: EditedHikeProgramSelectors = TestBed.get(EditedHikeProgramSelectors);

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
      const editedHikeProgramSelectors: EditedHikeProgramSelectors = TestBed.get(EditedHikeProgramSelectors);

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
      const editedHikeProgramSelectors: EditedHikeProgramSelectors = TestBed.get(EditedHikeProgramSelectors);

      store
        .pipe(
          select(editedHikeProgramSelectors.getDirty),
          takeUntil(destroy$)
        )
        .subscribe(res => (result = res));

      expect(result).toBeFalsy();

      store.dispatch(new editedHikeProgramActions.AddNewTranslatedHikeProgramDescription('hu_HU', {
        title: 'A new translation'
      }));
      expect(result).toBeTruthy();
    });
  });

  describe('getWorking', () => {
    it('should return editedHikeProgram working value', () => {
      let result;
      const editedHikeProgramSelectors: EditedHikeProgramSelectors = TestBed.get(EditedHikeProgramSelectors);

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
      const editedHikeProgramSelectors: EditedHikeProgramSelectors = TestBed.get(EditedHikeProgramSelectors);

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
      const editedHikeProgramSelectors: EditedHikeProgramSelectors = TestBed.get(EditedHikeProgramSelectors);
      const poiSelectors: PoiSelectors = TestBed.get(PoiSelectors);

      store.dispatch(new commonPoiActions.PoiLoaded(ids[0], pois[0]));

      store
        .select(editedHikeProgramSelectors.getHikePois(poiSelectors.getAllPois))
        .takeUntil(destroy$)
        .subscribe(res => (result = res));

      expect(result).toEqual([]);

      store.dispatch(new editedHikeProgramActions.SetStops([
        {
          poiId: pois[0].id
        }
      ]));

      expect(result).toEqual([pois[0]]);
    });
  });

  describe('getHikePoisCount', () => {
    it('should return editedHikeProgram pois count', () => {
      let result;
      const editedHikeProgramSelectors: EditedHikeProgramSelectors = TestBed.get(EditedHikeProgramSelectors);
      const poiSelectors: PoiSelectors = TestBed.get(PoiSelectors);

      store.dispatch(new commonPoiActions.PoiLoaded(ids[0], pois[0]));

      store
        .select(editedHikeProgramSelectors.getHikePoisCount(poiSelectors.getAllPois))
        .takeUntil(destroy$)
        .subscribe(res => (result = res));

      expect(result).toEqual(0);

      store.dispatch(new editedHikeProgramActions.SetStops([
        {
          poiId: pois[0].id
        }
      ]));

      expect(result).toEqual(1);
    });
  });

  describe('getStopsWithPoiNames', () => {
    it('should return stops with poi names', () => {
      let result;
      const editedHikeProgramSelectors: EditedHikeProgramSelectors = TestBed.get(EditedHikeProgramSelectors);
      const poiSelectors: PoiSelectors = TestBed.get(PoiSelectors);

      store.dispatch(new commonPoiActions.PoiLoaded(ids[0], pois[0]));

      store
        .select(editedHikeProgramSelectors.getStopsWithPoiNames(poiSelectors.getAllPois))
        .takeUntil(destroy$)
        .subscribe(res => (result = res));

      expect(result).toEqual([]);

      store.dispatch(new editedHikeProgramActions.SetStops([
        {
          poiId: pois[0].id
        }
      ]));

      expect(result).toEqual([{
        poiId: pois[0].id,
        description: pois[0].description
      }]);
    });
  });

  describe('getBackgroundOriginalUrls', () => {
    it('should return editedHikeProgram background original urls', () => {
      let result;
      const editedHikeProgramSelectors: EditedHikeProgramSelectors = TestBed.get(EditedHikeProgramSelectors);

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
});