import { TestBed } from '@angular/core/testing';
import { Store, StoreModule, select } from '@ngrx/store';
import { HikeEditMapSelectors } from '../hike-edit-map';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { IHikeEditMapState } from '../../state';
import { adminMapActions } from '../../actions';
import { hikeEditMapReducer } from '../../reducer';

describe('HikeEditMap selectors', () => {
  let store: Store<IHikeEditMapState>;
  let destroy$: Subject<boolean>;

  beforeEach(() => {
    destroy$ = new Subject<boolean>();

    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          hikeEditMap: hikeEditMapReducer
        })
      ],
      providers: [
        HikeEditMapSelectors
      ]
    });

    store = TestBed.get(Store);
    spyOn(store, 'dispatch').and.callThrough();
  });

  afterEach(() => {
    destroy$.next(true);
    destroy$.unsubscribe();
  });

  describe('getMapId', () => {
    it('should return admin map id', () => {
      let result;
      const hikeEditMapSelectors: HikeEditMapSelectors = TestBed.get(HikeEditMapSelectors);

      store
        .pipe(
          select(hikeEditMapSelectors.getMapId),
          takeUntil(destroy$)
        )
        .subscribe(res => (result = res));

      expect(result).toEqual('');

      store.dispatch(new adminMapActions.RegisterMap('mapID'));
      expect(result).toEqual('mapID');
    });
  });
});
