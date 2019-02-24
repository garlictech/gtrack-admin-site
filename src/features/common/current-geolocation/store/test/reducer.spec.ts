import { GeoPosition } from '../../interfaces';
import * as fromActions from '../actions';
import { reducer } from '../reducer';
import { createFeatureState } from './utils';

const mockLocation: GeoPosition = {
  coords: {
    accuracy: 20,
    altitude: null,
    altitudeAccuracy: null,
    heading: null,
    latitude: 47.5,
    longitude: 19.0833,
    speed: null
  },
  timestamp: 1542882905854
};

const testCases = [
  {
    actionName: 'StartPositioning',
    action: new fromActions.StartPositioning(),
    initialState: createFeatureState()
  },
  {
    actionName: 'EndPositioning',
    action: new fromActions.EndPositioning(),
    initialState: createFeatureState({ tracking: true })
  },
  {
    actionName: 'CurrentLocationObtained',
    action: new fromActions.CurrentLocationObtained(mockLocation),
    initialState: createFeatureState({ tracking: true })
  },
  {
    actionName: 'The Unknown Action',
    action: { type: 'The Unknow Action' as any },
    initialState: createFeatureState()
  },
  {
    actionName: 'The state init',
    action: { type: 'The undefined initial state' },
    initialState: undefined
  }
];

testCases.forEach(({ actionName, action, initialState }) => {
  test(`${actionName} with initial state ${JSON.stringify(initialState)}`, () => {
    expect(reducer(initialState, action)).toMatchSnapshot();
  });
});
