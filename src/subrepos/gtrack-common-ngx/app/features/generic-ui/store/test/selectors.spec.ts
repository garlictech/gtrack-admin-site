import * as _ from 'lodash';

import * as fromSelectors from '../selectors';
import { createState } from './utils';

const testCases = [
  {
    name: 'selectProgressSpinnerOn',
    selector: fromSelectors.selectProgressSpinnerOn,
    state: createState()
  },
  {
    name: 'selectProgressSpinnerText',
    selector: fromSelectors.selectProgressSpinnerText,
    state: createState()
  }
];

testCases.forEach(({ name, state, selector }) => {
  test(`${name} with input ${JSON.stringify(state)}`, () => {
    expect(selector(state)).toMatchSnapshot();
  });
});
