import * as _ from 'lodash';

import * as fromActions from '../actions';
import { reducer } from '../reducer';
import { createFeatureState } from './utils';

const testCases = [
  {
    actionName: 'ResetMap',
    action: new fromActions.ResetMap(),
    initialState: createFeatureState({ mapId: 'existingMapID' })
  },
  {
    actionName: 'RegisterMap',
    action: new fromActions.RegisterMap('mapID'),
    initialState: createFeatureState({})
  }
];

testCases.forEach(({ actionName, action, initialState }) => {
  test(`${actionName} with initial state ${JSON.stringify(initialState)}`, () => {
    expect(reducer(initialState, action)).toMatchSnapshot();
  });
});
