import { TestBed } from '@angular/core/testing';
import { createSelector, Store, StoreModule } from '@ngrx/store';
import * as _ from 'lodash';
import { LoaderWatchService } from '..';
import { reducer } from '../../../store/reducer';
import * as fromSelectors from '../../../store/selectors';
import { featureName } from '../../../store/state';

describe('LoaderWatch service test', () => {
  let service: LoaderWatchService;
  let store: Store<any>;
  let spy: any;
  const initialState: any = {};
  const reducerObj: any = {};

  reducerObj[featureName] = reducer;
  const selector = createSelector(
    fromSelectors.selectFeature,
    (state: any) => state.foo
  );

  const initTestBed = _initialState => {
    TestBed.configureTestingModule({
      imports: [StoreModule.forRoot(reducerObj, { initialState: _initialState })]
    });

    store = TestBed.get(Store);
    spy = jest.spyOn(store, 'dispatch');
    service = new LoaderWatchService(store);
  };

  const runner = (_initialState, done, label?) => {
    initTestBed(_initialState);
    service.spinnerOnWorking$(selector, label).subscribe(() => {
      const call = spy.mock.calls[0][0];
      expect(call).toMatchSnapshot();
      done();
    });
  };

  it('should switch on the spinner if the selector emits true', done => {
    initialState[featureName] = { foo: true };
    runner(initialState, done, 'foobarlabel');
  });

  it('should switch off the spinner if the selector emits false', done => {
    initialState[featureName] = { foo: false };
    runner(initialState, done, 'foobarlabel');
  });

  it('should handle the undefined text label', done => {
    initialState[featureName] = { foo: true };
    runner(initialState, done);
  });
});
