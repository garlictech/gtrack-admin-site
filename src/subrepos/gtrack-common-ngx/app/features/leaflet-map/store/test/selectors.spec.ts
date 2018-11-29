import { TestBed } from '@angular/core/testing';
import { Store, StoreModule, select } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { IState, featureName } from '../state';
import * as actions from '../actions';
import { reducer } from '../reducer';
import * as selectors from '../selectors';

describe('HikeEditMap selectors', () => {
  let store: Store<IState>;
  let destroy$: Subject<boolean>;

  beforeEach(() => {
    destroy$ = new Subject<boolean>();

    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          [featureName]: reducer
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

  describe('getMapId', () => {
    it('should return admin map id', () => {
      let result;

      store
        .pipe(
          select(selectors.getMapId),
          takeUntil(destroy$)
        )
        .subscribe(res => (result = res));

      expect(result).toEqual('');

      store.dispatch(new actions.RegisterMap('mapID'));
      expect(result).toEqual('mapID');
    });
  });
});
