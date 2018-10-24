import * as _ from 'lodash';

import { createFeatureState } from './utils';
import { reducer } from '../reducer';
import * as fromActions from '../actions';

const testCases = [
  {
    actionName: 'ShowProgressSpinner',
    action: new fromActions.ShowProgressSpinner('foobar'),
    initialState: createFeatureState({ progressSpinnerOn: false })
  },
  {
    actionName: 'HideProgressSpinner',
    action: new fromActions.HideProgressSpinner(),
    initialState: createFeatureState({ progressSpinnerOn: true, progressSpinnerText: 'foobar' })
  },
  {
    actionName: 'DisplayToast',
    action: new fromActions.DisplayToast({ summary: 'foobar' }),
    initialState: createFeatureState({ progressSpinnerOn: true, progressSpinnerText: 'foobar' })
  },
  {
    actionName: 'The Unknown Action',
    action: { type: 'The Unknown Action' as any },
    initialState: createFeatureState({ progressSpinnerOn: false })
  },
  {
    actionName: 'The undefined initial state',
    action: { type: 'The undefined initial state' },
    initialState: undefined
  }
];

testCases.forEach(({ actionName, action, initialState }) => {
  test(`${actionName} with initial state ${JSON.stringify(initialState)}`, () => {
    expect(reducer(initialState, action)).toMatchSnapshot();
  });
});
