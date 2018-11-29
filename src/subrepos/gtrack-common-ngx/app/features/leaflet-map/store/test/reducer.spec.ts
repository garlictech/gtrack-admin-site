import * as _ from 'lodash';

import { createFeatureState } from './utils';
import { reducer } from '../reducer';
import * as fromActions from '../actions';

const testCases = [
  {
    actionName: 'ResetMap',
    action: new fromActions.ResetMap(),
    initialState: createFeatureState({ mapId: 'existingMapID' })
  },
  {
    actionName: 'RegisterMap',
    action: new fromActions.RegisterMap('mapID'),
    initialState: createFeatureState({ })
  }
];

testCases.forEach(({ actionName, action, initialState }) => {
  test(`${actionName} with initial state ${JSON.stringify(initialState)}`, () => {
    expect(reducer(initialState, action)).toMatchSnapshot();
  });
});
