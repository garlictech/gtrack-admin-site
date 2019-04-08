import * as _ from 'lodash';

import * as fromActions from '../actions';
import { markerIconsReducer } from '../reducer';
import { createFeatureState, createSvgContent, createSvgContentEntityState } from './utils';

const contents = [createSvgContent('atm'), createSvgContent('bank')];

const testCases = [
  {
    actionName: 'Reset',
    action: new fromActions.Reset(),
    initialState: createFeatureState({
      markers: createSvgContentEntityState(contents),
      icons: createSvgContentEntityState(contents)
    })
  },
  {
    actionName: 'AddSvgIconContents',
    action: new fromActions.AddSvgIconContents(contents),
    initialState: createFeatureState()
  },
  {
    actionName: 'AddSvgMarkerContents',
    action: new fromActions.AddSvgMarkerContents(contents),
    initialState: createFeatureState()
  }
];

testCases.forEach(({ actionName, action, initialState }) => {
  test(`${actionName} with initial state ${JSON.stringify(initialState)}`, () => {
    expect(markerIconsReducer(initialState, action)).toMatchSnapshot();
  });
});
