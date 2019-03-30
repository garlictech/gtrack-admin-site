import * as actions from '../actions';
import { createSvgContent } from './utils';

describe('MarkerIcon actions', () => {
  it('should have action names defined', () => {
    expect(actions.ActionTypes.Reset).toEqual('[Marker icons] Reset');
    expect(actions.ActionTypes.AddSvgIconContents).toEqual('[Marker icons] Add SVG icon contents');
    expect(actions.ActionTypes.AddSvgMarkerContents).toEqual('[Marker icons] Add SVG marker contents');
  });

  it('should create Reset action', () => {
    const action = new actions.Reset();

    expect(action).toBeDefined();
    expect({ ...action }).toEqual({
      type: actions.ActionTypes.Reset
    });
  });

  it('should create AddSvgIconContents action', () => {
    const contents = [createSvgContent('atm'), createSvgContent('bank')];
    const action = new actions.AddSvgIconContents(contents);

    expect(action).toBeDefined();
    expect({ ...action }).toEqual({
      type: actions.ActionTypes.AddSvgIconContents,
      svgContents: contents
    });
  });

  it('should create AddSvgMarkerContents action', () => {
    const contents = [createSvgContent('atm'), createSvgContent('bank')];
    const action = new actions.AddSvgMarkerContents(contents);

    expect(action).toBeDefined();
    expect({ ...action }).toEqual({
      type: actions.ActionTypes.AddSvgMarkerContents,
      svgContents: contents
    });
  });
});
