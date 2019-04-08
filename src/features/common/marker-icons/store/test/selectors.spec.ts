import { EIconStyle } from '../../enums';
import * as fromSelectors from '../selectors';
import { createState, createSvgContent, createSvgContentEntityState } from './utils';

const _state = createState({
  markers: createSvgContentEntityState([createSvgContent('atm'), createSvgContent('bank'), createSvgContent('cafe')]),
  icons: createSvgContentEntityState([createSvgContent('atm'), createSvgContent('bank')])
});

const testCases = [
  {
    name: 'getAllSvgIcons',
    selector: fromSelectors.getAllSvgIcons,
    state: { ..._state }
  },
  {
    name: 'getAllSvgIconsCount',
    selector: fromSelectors.getAllSvgIconsCount,
    state: { ..._state }
  },
  {
    name: 'getAllSvgMarkers',
    selector: fromSelectors.getAllSvgMarkers,
    state: { ..._state }
  },
  {
    name: 'getAllSvgMarkersCount',
    selector: fromSelectors.getAllSvgMarkersCount,
    state: { ..._state }
  },
  {
    name: 'getIcon - encoded - default',
    selector: fromSelectors.getIcon('atm', true, EIconStyle.DEFAULT),
    state: { ..._state }
  },
  {
    name: 'getMarker - encoded - default',
    selector: fromSelectors.getMarker('atm', true, EIconStyle.DEFAULT),
    state: { ..._state }
  },
  {
    name: 'getIcon - not encoded - default',
    selector: fromSelectors.getIcon('atm', false, EIconStyle.DEFAULT),
    state: { ..._state }
  },
  {
    name: 'getMarker - not encoded - default',
    selector: fromSelectors.getMarker('atm', false, EIconStyle.DEFAULT),
    state: { ..._state }
  },
  {
    name: 'getIcon - not encoded - highlighted',
    selector: fromSelectors.getIcon('atm', false, EIconStyle.HIGHLIGHTED),
    state: { ..._state }
  },
  {
    name: 'getMarker - not encoded - highlighted',
    selector: fromSelectors.getMarker('atm', false, EIconStyle.HIGHLIGHTED),
    state: { ..._state }
  }
];

testCases.forEach(({ name, selector, state }) => {
  test(`${name} with input ${JSON.stringify(state)}`, () => {
    expect(selector(state)).toMatchSnapshot();
  });
});
