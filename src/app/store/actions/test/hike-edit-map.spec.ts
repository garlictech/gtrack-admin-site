import * as HikeEditMapActions from '../hike-edit-map';

describe('HikeEditMap actions', () => {
  it('should have action names defined', () => {
    expect(HikeEditMapActions.RESET_MAP_STATE).toEqual('[HikeEditMap] Reset');
  });

  it('should create Reset action', () => {
    const action = new HikeEditMapActions.ResetMapState();

    expect(action).toBeDefined();
    expect({ ...action }).toEqual({
      type: HikeEditMapActions.RESET_MAP_STATE
    });
  });
});
