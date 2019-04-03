import * as fromSelectors from '../selectors';
import { createState } from './utils';

const testCases = [
  {
    name: 'getMapId',
    selector: fromSelectors.getMapId,
    state: createState()
  },
  {
    name: 'selectFeatureId',
    selector: fromSelectors.selectFeatureId,
    state: createState({ featureId: 2 })
  }
];

testCases.forEach(({ name, selector, state }) => {
  test(`${name} with input ${JSON.stringify(state)}`, () => {
    expect(selector(state)).toMatchSnapshot();
  });
});
