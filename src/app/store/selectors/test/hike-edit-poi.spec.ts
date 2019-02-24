// tslint:disable:no-big-function
import * as _ from 'lodash';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { TestBed } from '@angular/core/testing';
import { select, Store, StoreModule } from '@ngrx/store';

import { EPoiTypes } from '../../../../subrepos/provider-client';
import { hikeEditPoiActions } from '../../actions';
import { hikeEditPoiReducer, initialContextItemState } from '../../reducer';
import { pois as poiFixtures } from '../../reducer/test/fixtures';
import * as hikeEditPoiSelectors from '../../selectors/hike-edit-poi';
import { HikeEditPoiState } from '../../state';

describe('HikeEditPoi selectors', () => {
  let store: Store<HikeEditPoiState>;
  let destroy$: Subject<boolean>;
  let pois: Array<any>;

  beforeEach(() => {
    pois = _.cloneDeep(poiFixtures);
    destroy$ = new Subject<boolean>();

    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          hikeEditPoi: hikeEditPoiReducer
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

  describe('getAllGooglePois', () => {
    it('should return all google poi', () => {
      let result;

      store
        .pipe(
          select(hikeEditPoiSelectors.getAllGooglePois),
          takeUntil(destroy$)
        )
        .subscribe(res => (result = res));

      expect(result).toEqual([]);

      store.dispatch(new hikeEditPoiActions.SetGooglePois(pois));
      expect(result).toEqual(pois);
    });
  });

  describe('getAllOsmAmenityPois', () => {
    it('should return all osmAmenity poi', () => {
      let result;

      store
        .pipe(
          select(hikeEditPoiSelectors.getAllOsmAmenityPois),
          takeUntil(destroy$)
        )
        .subscribe(res => (result = res));

      expect(result).toEqual([]);

      store.dispatch(new hikeEditPoiActions.SetOsmAmenityPois(pois));
      expect(result).toEqual(pois);
    });
  });

  describe('getAllOsmNaturalPois', () => {
    it('should return all osmNatural poi', () => {
      let result;

      store
        .pipe(
          select(hikeEditPoiSelectors.getAllOsmNaturalPois),
          takeUntil(destroy$)
        )
        .subscribe(res => (result = res));

      expect(result).toEqual([]);

      store.dispatch(new hikeEditPoiActions.SetOsmNaturalPois(pois));
      expect(result).toEqual(pois);
    });
  });

  describe('getAllOsmRoutePois', () => {
    it('should return all osmRoute poi', () => {
      let result;

      store
        .pipe(
          select(hikeEditPoiSelectors.getAllOsmRoutePois),
          takeUntil(destroy$)
        )
        .subscribe(res => (result = res));

      expect(result).toEqual([]);

      store.dispatch(new hikeEditPoiActions.SetOsmRoutePois(pois));
      expect(result).toEqual(pois);
    });
  });

  describe('getAllWikipediaPois', () => {
    it('should return all wikipedia poi', () => {
      let result;

      store
        .pipe(
          select(hikeEditPoiSelectors.getAllWikipediaPois),
          takeUntil(destroy$)
        )
        .subscribe(res => (result = res));

      expect(result).toEqual([]);

      store.dispatch(new hikeEditPoiActions.SetWikipediaPois(pois));
      expect(result).toEqual(pois);
    });
  });

  describe('getAllCollectorPois', () => {
    it('should return all collector poi', () => {
      let result;

      store
        .pipe(
          select(hikeEditPoiSelectors.getAllCollectorPois),
          takeUntil(destroy$)
        )
        .subscribe(res => (result = res));

      expect(result).toEqual([]);

      store.dispatch(new hikeEditPoiActions.AddPoisToCollector(pois));
      expect(result).toEqual(pois);
    });
  });

  describe('getMergeSelections', () => {
    it('should return merge selections', () => {
      let result;

      store
        .pipe(
          select(hikeEditPoiSelectors.getMergeSelections),
          takeUntil(destroy$)
        )
        .subscribe(res => (result = res));

      expect(result).toEqual([]);

      store.dispatch(new hikeEditPoiActions.AddGTrackPoiToMergeSelection([pois[0].id]));
      expect(result).toEqual([pois[0].id]);
    });
  });

  describe('getMergeSelectionsCount', () => {
    it('should return merge selections count', () => {
      let result;

      store
        .pipe(
          select(hikeEditPoiSelectors.getMergeSelectionsCount),
          takeUntil(destroy$)
        )
        .subscribe(res => (result = res));

      expect(result).toEqual(0);

      store.dispatch(new hikeEditPoiActions.AddGTrackPoiToMergeSelection([pois[0].id]));
      expect(result).toEqual(1);
    });
  });

  describe('getSaveablePoisCount', () => {
    it('should return merge selections count', () => {
      let result;

      store
        .pipe(
          select(hikeEditPoiSelectors.getSaveablePoisCount(EPoiTypes.wikipedia)),
          takeUntil(destroy$)
        )
        .subscribe(res => (result = res));

      expect(result).toEqual(0);

      store.dispatch(new hikeEditPoiActions.SetWikipediaPois([pois[0]]));
      store.dispatch(new hikeEditPoiActions.SetWikipediaPoiSelected([pois[0].id]));
      store.dispatch(
        new hikeEditPoiActions.SetWikipediaPoisInGtrackDb({
          id: pois[0].id,
          inGtrackDb: false
        })
      );
      expect(result).toEqual(1);
    });
  });

  describe('getSelectedCollectorPois', () => {
    it('should return selected collector pois', () => {
      let result;

      store
        .pipe(
          select(hikeEditPoiSelectors.getSelectedCollectorPois()),
          takeUntil(destroy$)
        )
        .subscribe(res => (result = res));

      expect(result).toEqual([]);

      store.dispatch(new hikeEditPoiActions.AddPoisToCollector([pois[0], pois[1]]));
      store.dispatch(new hikeEditPoiActions.SetCollectorPoiSelected([pois[1].id]));
      expect(result).toEqual([_.merge({}, pois[1], { selected: true })]);
    });
  });

  describe('getCollectorPoi', () => {
    it('should return collector poi', () => {
      let result;

      store
        .pipe(
          select(hikeEditPoiSelectors.getCollectorPoi(pois[0].id)),
          takeUntil(destroy$)
        )
        .subscribe(res => (result = res));

      expect(result).toBeUndefined();

      store.dispatch(new hikeEditPoiActions.AddPoisToCollector([pois[0], pois[1]]));
      expect(result).toEqual(pois[0]);
    });
  });

  describe('getCollectorPoisCount', () => {
    it('should return collector pois count', () => {
      let result;

      store
        .pipe(
          select(hikeEditPoiSelectors.getCollectorPoisCount()),
          takeUntil(destroy$)
        )
        .subscribe(res => (result = res));

      expect(result).toEqual(0);

      store.dispatch(new hikeEditPoiActions.AddPoisToCollector([pois[0], pois[1]]));
      expect(result).toEqual(2);
    });
  });

  describe('getPoiPhotos', () => {
    it('should return poi photos', () => {
      let result;

      store
        .pipe(
          select(hikeEditPoiSelectors.getPoiPhotos(EPoiTypes.google)),
          takeUntil(destroy$)
        )
        .subscribe(res => (result = res));

      expect(result).toEqual([]);

      store.dispatch(new hikeEditPoiActions.SetGooglePois([pois[0], pois[1]]));
      expect(result).toEqual([...pois[0].google.photos, ...pois[1].google.photos]);
    });
  });

  describe('getHikeEditPoiContextSelector', () => {
    it('should return poi context', () => {
      let result;

      store
        .pipe(
          select(hikeEditPoiSelectors.getHikeEditPoiContextSelector(EPoiTypes.wikipedia)),
          takeUntil(destroy$)
        )
        .subscribe(res => (result = res));

      expect(result).toEqual(initialContextItemState);

      store.dispatch(new hikeEditPoiActions.GetWikipediaPois(undefined, 'fakeMapId'));
      expect(result).toEqual(_.merge({}, initialContextItemState, { loading: true }));
    });
  });

  describe('getHikeEditPoiContextPropertySelector', () => {
    it('should return poi context property', () => {
      let result;

      store
        .pipe(
          select(hikeEditPoiSelectors.getHikeEditPoiContextPropertySelector(EPoiTypes.wikipedia, 'loading')),
          takeUntil(destroy$)
        )
        .subscribe(res => (result = res));

      expect(result).toBeFalsy();

      store.dispatch(new hikeEditPoiActions.GetWikipediaPois(undefined, 'fakeMapId'));
      expect(result).toBeTruthy();
    });
  });
});
