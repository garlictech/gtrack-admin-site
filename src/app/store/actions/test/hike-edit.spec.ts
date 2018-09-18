import * as HikeEditActions from '../hike-edit';

describe('HikeList actions', () => {
  it('should have action names defined', () => {
    expect(HikeEditActions.COLLECT_HIKE_DATA).toEqual('[HikeEdit] Collect hike data');
  });

  it('should create DeleteHike action', () => {
    const action = new HikeEditActions.CollectHikeData();

    expect(action).toBeDefined();
    expect({ ...action }).toEqual({
      type: HikeEditActions.COLLECT_HIKE_DATA
    });
  });
});
