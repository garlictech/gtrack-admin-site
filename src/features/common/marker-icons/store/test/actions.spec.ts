/*
import * as actions from '../actions';

describe('AdminMap actions', () => {
  it('should have action names defined', () => {
    expect(actions.ActionTypes.RegisterMap).toEqual('[Leaflet Map] Register Map');
    expect(actions.ActionTypes.ResetMap).toEqual('[Leaflet Map] Reset Map');
  });

  it('should create RegisterMap action', () => {
    const mapId = 'fakeMapId';
    const action = new actions.RegisterMap(mapId);

    expect(action).toBeDefined();
    expect({ ...action }).toEqual({
      type: actions.ActionTypes.RegisterMap,
      mapId
    });
  });

  it('should create ResetMap action', () => {
    const action = new actions.ResetMap();

    expect(action).toBeDefined();
    expect({ ...action }).toEqual({
      type: actions.ActionTypes.ResetMap
    });
  });

  it('should create AddFeature action', () => {
    const id = 1;
    const action = new actions.AddFeature({ id });

    expect(action).toBeDefined();
    expect({ ...action }).toEqual({
      type: actions.ActionTypes.AddFeature,
      payload: { id }
    });
  });
});
*/
